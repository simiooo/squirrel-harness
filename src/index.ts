import fs from "node:fs/promises";
import path from "node:path";
import { scanAllSkills } from "./skill-scanner.ts";
import { SemanticIndexer } from "./semantic-indexer.ts";
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
  await fs.writeFile(CONFIG.INDEX_OUTPUT, JSON.stringify(index, null, 2));
  Logger.info(`Harness index saved to ${CONFIG.INDEX_OUTPUT}`);
  Logger.info("The synthesis of structure and perception is complete.");
};

main().catch((err) => {
  Logger.error("⚖️ Harness motion interrupted:", String(err));
  process.exit(1);
});
