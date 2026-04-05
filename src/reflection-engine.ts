import fs from "node:fs/promises";
import path from "node:path";
import { Logger } from "./logger.ts";
import type { ReflectionResult } from "./types/reflection.ts";

/**
 * The Dialectician.
 * It processes raw memory logs into structured philosophical insights.
 */
export class ReflectionEngine {
  private memoryDir: string;

  constructor(memoryDir: string) {
    this.memoryDir = memoryDir;
  }

  /**
   * Reads the daily logs to form the "raw material" of the dream.
   */
  async gatherDailyLogs(date: Date): Promise<string> {
    const dateStr = date.toISOString().split("T")[0];
    const logPath = path.join(this.memoryDir, `${dateStr}.md`);

    try {
      const content = await fs.readFile(logPath, "utf-8");
      Logger.info(`Recalling memories from ${dateStr}...`);
      return content;
    } catch {
      Logger.warn(`No logs found for ${dateStr}. The void is silent.`);
      return "";
    }
  }

  /**
   * The Dialectic Process.
   * In a real implementation, this would call an LLM (like MiniMax or Qwen)
   * to analyze the logs and return a structured ReflectionResult.
   */
  async reflect(logs: string): Promise<ReflectionResult> {
    if (!logs) {
      return {
        successes: [],
        failures: [],
        evolvedRules: [],
        summary: "A day of silence.",
      };
    }

    Logger.info("Entering the dialectic state...");

    // Simulation of the LLM's synthesis process:
    // 1. Identify Thesis (Successes)
    // 2. Identify Antithesis (Failures/Contradictions)
    // 3. Derive Synthesis (Evolved Rules)

    return {
      successes: ["Identified the need for a semantic router.", "Established strict TS typing."],
      failures: ["SSH key permissions were not ready.", "Sharp module dependency conflict."],
      evolvedRules: [
        "Always verify SSH agent status before Git operations.",
        "Prefer pure-TS embedding libraries to avoid native build issues.",
      ],
      summary:
        "A day of foundational construction. The harness is taking shape through the resolution of technical contradictions.",
    };
  }

  /**
   * Persists the dream back into the long-term memory (MEMORY.md).
   */
  async consolidate(result: ReflectionResult): Promise<void> {
    const memoryPath = path.join(this.memoryDir, "..", "MEMORY.md");
    const dreamEntry = `\n### Dream Synthesis (${new Date().toISOString().split("T")[0]})\n- **Summary:** ${result.summary}\n- **New Rules:**\n${result.evolvedRules.map((r) => `  - ${r}`).join("\n")}\n`;

    await fs.appendFile(memoryPath, dreamEntry);
    Logger.info("Dream consolidated into long-term memory.");
  }
}
