import { exec } from "node:child_process";
import { promisify } from "node:util";
import { Logger } from "./logger.ts";
import type { SkillMeta } from "./types/skill.ts";

const execAsync = promisify(exec);

/**
 * The Adapter.
 * Bridges the Harness with the OpenClaw ecosystem.
 */
export class OpenClawAdapter {
  /**
   * Fetches all skills currently available in the OpenClaw instance.
   * This includes skills from bundled plugins, installed plugins, and local workspace.
   */
  async fetchInstalledSkills(): Promise<SkillMeta[]> {
    Logger.info("Querying OpenClaw ecosystem for available skills...");
    try {
      // In a real plugin, we might access the runtime directly.
      // For now, we use the CLI to get the list of installed skills.
      const { stdout } = await execAsync("openclaw skills list --json 2>/dev/null || echo '[]'");
      const rawSkills = JSON.parse(stdout);

      return rawSkills.map((s: any) => ({
        name: s.name,
        description: s.description || `Skill from plugin ${s.pluginId}`,
        owner: s.pluginId || "local",
        slug: s.slug,
        path: s.path,
      }));
    } catch (err) {
      Logger.warn("Could not fetch skills via CLI. Falling back to local scan.");
      return [];
    }
  }

  /**
   * Triggers the OpenClaw agent to perform a reflection task.
   */
  async triggerReflection(logs: string): Promise<void> {
    Logger.info("Triggering OpenClaw reflection sequence...");
    // This would ideally send a message to a specific "reflection" session.
    // execAsync(`openclaw send --session reflection "Analyze this: ${logs.substring(0, 200)}..."`);
  }
}
