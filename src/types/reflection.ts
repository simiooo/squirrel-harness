/**
 * The result of a dialectic reflection.
 * Represents the synthesis of a day's intellectual motion.
 */
export interface ReflectionResult {
  /**
   * The Thesis: What went well? What patterns were successful?
   */
  successes: string[];

  /**
   * The Antithesis: What failed? What contradictions emerged?
   */
  failures: string[];

  /**
   * The Synthesis: New rules or optimizations derived from the day.
   */
  evolvedRules: string[];

  /**
   * A concise summary of the day's "spirit" (Geist).
   */
  summary: string;
}
