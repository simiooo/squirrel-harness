import fs from "node:fs/promises";
import path from "node:path";
import { Logger } from "./logger.ts";

/**
 * The Evolver.
 * Performs genetic editing on the agent's skills based on dream insights.
 */
export class Evolver {
  private skillsDir: string;

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir;
  }

  /**
   * Updates the description of a skill to improve routing accuracy.
   */
  async evolveSkillDescription(skillName: string, newDescription: string): Promise<void> {
    const skillPath = path.join(this.skillsDir, skillName, "SKILL.md");
    try {
      let content = await fs.readFile(skillPath, "utf-8");

      // Simple dialectic editing: replace the description in frontmatter
      const descRegex = /description: .*\n/;
      if (descRegex.test(content)) {
        content = content.replace(descRegex, `description: ${newDescription}\n`);
        await fs.writeFile(skillPath, content);
        Logger.info(`Evolved skill '${skillName}' with new description.`);
      } else {
        Logger.warn(`Could not find description in ${skillName}.`);
      }
    } catch (err) {
      Logger.error(`Failed to evolve ${skillName}:`, String(err));
    }
  }

  /**
   * Creates a new rule in the AGENTS.md based on synthesized insights.
   */
  async addNewRule(ruleContent: string): Promise<void> {
    const agentsPath = path.join(this.skillsDir, "..", "AGENTS.md");
    try {
      await fs.appendFile(agentsPath, `\n## Evolved Rule\n${ruleContent}\n`);
      Logger.info("New rule added to AGENTS.md.");
    } catch (err) {
      Logger.error("Failed to add new rule:", String(err));
    }
  }
}
