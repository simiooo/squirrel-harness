import { pipeline } from "@huggingface/transformers";
import { Logger } from "./logger.ts";
import type { SkillMeta, SkillIndex } from "./types/skill.ts";

/**
 * The Dreamer: Converts text descriptions into mathematical meaning.
 * We use a highly efficient, local-first embedding model.
 */
export class SemanticIndexer {
  private extractor: any;

  async init() {
    // Using all-MiniLM-L6-v2 for its perfect balance of speed and semantic quality.
    Logger.info("Loading embedding model...");
    this.extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  /**
   * Generates embeddings for a batch of skills.
   */
  async indexSkills(skills: SkillMeta[]): Promise<SkillIndex[]> {
    Logger.info(`Awakening... processing ${skills.length} skills.`);

    const descriptions = skills.map((s) => s.description);

    // Ensure the model is loaded before we try to use it
    await this.extractor;

    const output = await this.extractor(descriptions, { pooling: "mean", normalize: true });

    // The output tensor contains the embeddings.
    return skills.map((meta, i) => ({
      meta,
      // Extract the tensor data for this specific skill.
      embedding: output[i].tolist(),
    }));
  }
}
