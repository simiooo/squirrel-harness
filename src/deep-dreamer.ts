import { Logger } from "./logger.ts";

/**
 * The Deep Dreamer.
 * Connects to an LLM to perform dialectic analysis on agent logs.
 */
export class DeepDreamer {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "openrouter/qwen/qwen3.6-plus:free") {
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Sends raw logs to the LLM for dialectic processing.
   */
  async reflect(logs: string): Promise<string> {
    if (!logs) return "A day of silence.";

    Logger.info("Entering the Deep Dream state...");

    const prompt = `
      Act as a Hegelian dialectician for an AI agent system. 
      Analyze the following daily logs:
      """
      ${logs}
      """
      
      Provide a structured reflection:
      1. Thesis (What worked well?)
      2. Antithesis (What failed or contradicted the goals?)
      3. Synthesis (What specific rules or skills should be evolved?)
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const insight = data.choices?.[0]?.message?.content || "The dream was void.";
      Logger.info("Deep Dream complete.");
      return insight;
    } catch (err) {
      Logger.error("Deep Dream interrupted:", String(err));
      return "The dream was disturbed by external forces.";
    }
  }
}
