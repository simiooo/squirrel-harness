import { Logger } from "./logger.ts";

/**
 * The Deep Dreamer (OpenClaw Native).
 * Instead of calling an API directly, it prepares the prompt for the OpenClaw runtime.
 */
export class DeepDreamer {
  /**
   * Generates the dialectic prompt for the OpenClaw agent.
   */
  generateDialecticPrompt(logs: string): string {
    return `
      Act as a Hegelian dialectician for the OpenClaw agent system. 
      Analyze the following session logs:
      """
      ${logs}
      """
      
      Provide a structured reflection:
      1. Thesis (What worked well?)
      2. Antithesis (What failed or contradicted the goals?)
      3. Synthesis (What specific rules or skills should be evolved?)
      
      Output the result as a structured markdown block.
    `;
  }

  async reflect(logs: string): Promise<string> {
    if (!logs) return "A day of silence.";
    Logger.info("Deep Dream prompt generated. Awaiting OpenClaw runtime execution...");
    return this.generateDialecticPrompt(logs);
  }
}
