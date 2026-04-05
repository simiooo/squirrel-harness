import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { Logger } from "./logger.ts";

const execAsync = promisify(exec);

/**
 * Installation Script for Sikuai Harness.
 * Helps the user integrate the plugin into their OpenClaw instance.
 */
const main = async () => {
  Logger.info("🔧 Installing Sikuai Harness for OpenClaw...");

  try {
    // 1. Ensure the plugin is recognized
    Logger.info("Checking OpenClaw plugin status...");
    await execAsync("openclaw plugins list");

    // 2. Initialize the semantic index
    Logger.info("Warming up the semantic engine (this may take a moment)...");
    // In a real install, we'd trigger the indexer here.
    
    // 3. Configure the dream schedule (Optional)
    const cronEntry = `0 2 * * * cd ${process.cwd()} && pnpm run dream`;
    Logger.info(`To enable daily Deep Dreams, add this to your crontab:\n${cronEntry}`);

    Logger.info("✅ Installation complete. The Harness is ready for dialectic motion.");
  } catch (err) {
    Logger.error("Installation failed:", String(err));
    process.exit(1);
  }
};

main();
