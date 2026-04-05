import fs from "node:fs/promises";
import path from "node:path";
import { CONFIG } from "./config.ts";
import { Logger } from "./logger.ts";
import type { SkillMeta } from "./types/skill.ts";

/**
 * Simple YAML frontmatter parser.
 * We use a lightweight approach to avoid heavy dependencies for this specific task.
 */
const parseFrontmatter = (content: string): Record<string, unknown> => {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return {};

  const yaml = match[1];
  const meta: Record<string, unknown> = {};

  yaml.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      meta[key.trim()] = valueParts.join(":").trim().replace(/['"]/g, "");
    }
  });

  return meta;
};

/**
 * Scans a single skill directory and extracts its metadata.
 */
const scanSkillDirectory = async (dirPath: string): Promise<SkillMeta | null> => {
  try {
    const skillMdPath = path.join(dirPath, "SKILL.md");
    const content = await fs.readFile(skillMdPath, "utf-8");
    const meta = parseFrontmatter(content);

    return {
      name: (meta.name as string) || path.basename(dirPath),
      description: (meta.description as string) || "No description provided.",
      owner: (meta.owner as string) || "local",
      slug: path.basename(dirPath),
      path: dirPath,
    };
  } catch {
    return null;
  }
};

/**
 * The Sentinel: Scans all configured skill directories.
 */
export const scanAllSkills = async (): Promise<SkillMeta[]> => {
  const skills: SkillMeta[] = [];

  for (const skillsDir of CONFIG.SKILLS_DIRS) {
    try {
      const entries = await fs.readdir(skillsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skill = await scanSkillDirectory(path.join(skillsDir, entry.name));
          if (skill) skills.push(skill);
        }
      }
    } catch {
      // Directory might not exist, which is fine.
      Logger.warn(`Skipping non-existent or inaccessible directory: ${skillsDir}`);
    }
  }

  return skills;
};
