import fs from "node:fs/promises";
import { pipeline } from "@huggingface/transformers";
import { Logger } from "./logger.ts";
import { CONFIG } from "./config.ts";
import type { SkillMeta, SkillIndex } from "./types/skill.ts";

/**
 * The Neural Router.
 * Maps natural language intent to the most relevant Skill definitions.
 */
export class SkillRouter {
  private index: SkillIndex[] = [];
  private extractor: any;

  /**
   * Loads the pre-computed semantic index.
   */
  async loadIndex(): Promise<void> {
    try {
      const data = await fs.readFile(CONFIG.INDEX_OUTPUT, "utf-8");
      this.index = JSON.parse(data);
      Logger.info(`Index loaded with ${this.index.length} skills.`);
    } catch {
      Logger.error("Index not found. Please run the indexer first.");
      throw new Error("Skill index missing");
    }
  }

  /**
   * Initializes the embedding model.
   */
  async init(): Promise<void> {
    Logger.info("Initializing semantic router model...");
    this.extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    );
  }

  /**
   * Computes cosine similarity between two vectors.
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB || 1);
  }

  /**
   * Finds the top-K skills for a given user query.
   */
  async route(query: string, k: number = 3): Promise<SkillMeta[]> {
    if (!this.extractor) await this.init();
    if (this.index.length === 0) await this.loadIndex();

    // 1. Embed the user's intent
    const queryResult = await this.extractor(query, {
      pooling: "mean",
      normalize: true,
    });
    const queryVector: number[] = queryResult.tolist();

    // 2. Calculate similarity for all skills
    const scoredSkills = this.index.map((item) => {
      const storedVector = item.embedding;
      return {
        meta: item.meta,
        score: this.cosineSimilarity(queryVector, storedVector),
      };
    });

    // 3. Sort and return top-K (Thesis -> Synthesis)
    scoredSkills.sort((a, b) => b.score - a.score);
    return scoredSkills.slice(0, k).map((s) => s.meta);
  }
}
