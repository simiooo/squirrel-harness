import os from "node:os";
import path from "node:path";

/**
 * Configuration for the Sikuai Harness.
 * Defines the boundaries of our agent's known universe.
 */
export const CONFIG = {
  // The root of the OpenClaw workspace
  WORKSPACE_ROOT: path.join(os.homedir(), ".openclaw", "workspace"),

  // Where skills are typically stored in OpenClaw
  SKILLS_DIRS: [
    path.join(os.homedir(), ".openclaw", "workspace", "skills"),
    path.join(os.homedir(), ".openclaw", "skills"),
  ],

  // The output file for our semantic index
  INDEX_OUTPUT: path.join(process.cwd(), "data", "skills-index.json"),
};
