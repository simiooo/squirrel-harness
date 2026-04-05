import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { scanAllSkills } from "./skill-scanner.ts";
import { SemanticIndexer } from "./semantic-indexer.ts";
import { SkillRouter } from "./skill-router.ts";
import { ReflectionEngine } from "./reflection-engine.ts";
import { CONFIG } from "./config.ts";
import { Logger } from "./logger.ts";

/**
 * Main execution entry point.
 * The dialectic motion of agent optimization begins here.
 */
const main = async (): Promise<void> => {
  Logger.info("⚖️ Sikuai Harness is waking up...");

  // 1. Thesis: Scan the filesystem for all available skills.
  const skills = await scanAllSkills();
  Logger.info(`Discovered ${skills.length} skills in the material world.`);

  if (skills.length === 0) {
    Logger.warn("No skills found. The void is empty.");
    return;
  }

  // 2. Antithesis: Index the skills using semantic embeddings.
  const indexer = new SemanticIndexer();
  await indexer.init();
  await indexer.indexSkills(skills);
  Logger.info("Semantic mappings complete.");

  // 3. Synthesis: Persist the index for the agent to use.
  await fs.mkdir(path.dirname(CONFIG.INDEX_OUTPUT), { recursive: true });
  await fs.writeFile(CONFIG.INDEX_OUTPUT, JSON.stringify(skills, null, 2));
  Logger.info(`Harness index saved to ${CONFIG.INDEX_OUTPUT}`);
  Logger.info("The synthesis of structure and perception is complete.");

  // 4. The Dream: Reflect and Evolve.
  const memoryDir = path.join(os.homedir(), ".openclaw", "workspace", "memory");
  const dreamer = new ReflectionEngine(memoryDir);
  const logs = await dreamer.gatherDailyLogs(new Date());
  const insight = await dreamer.reflect(logs);
  await dreamer.consolidate(insight);
  Logger.info(`Dreamt: "${insight.summary}"`);

  // 5. Real-time Routing Demo: The Nervous System.
  const router = new SkillRouter();
  await router.init();

  const testQuery = "I need to plan the next release features";
  const matches = await router.route(testQuery);
  Logger.info(`Routing query: "${testQuery}"`);
  Logger.info(`Top match: ${matches[0]?.name || "None"}`);
};

main().catch((err) => {
  Logger.error("⚖️ Harness motion interrupted:", String(err));
  process.exit(1);
});
