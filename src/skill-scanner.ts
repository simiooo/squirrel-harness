import { OpenClawAdapter } from "./openclaw-adapter.ts";
import { Logger } from "./logger.ts";
import type { SkillMeta } from "./types/skill.ts";

/**
 * The Sentinel.
 * Now acts as a caching layer for the OpenClaw ecosystem's skills.
 */
export class SkillScanner {
  private adapter = new OpenClawAdapter();

  /**
   * Syncs the local cache with the live OpenClaw skill registry.
   */
  async syncSkills(): Promise<SkillMeta[]> {
    Logger.info("Initiating dialectic sync with OpenClaw registry...");
    const skills = await this.adapter.fetchInstalledSkills();
    Logger.info(`Synced ${skills.length} skills from the ecosystem.`);
    return skills;
  }
}
