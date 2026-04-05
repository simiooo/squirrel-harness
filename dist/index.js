import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { pipeline } from "@huggingface/transformers";
//#region src/config.ts
/**
* Configuration for the Sikuai Harness.
* Defines the boundaries of our agent's known universe.
*/
const CONFIG = {
	WORKSPACE_ROOT: path.join(os.homedir(), ".openclaw", "workspace"),
	SKILLS_DIRS: [path.join(os.homedir(), ".openclaw", "workspace", "skills"), path.join(os.homedir(), ".openclaw", "skills")],
	INDEX_OUTPUT: path.join(process.cwd(), "data", "skills-index.json")
};
//#endregion
//#region src/logger.ts
/**
* The Voice of the Harness.
* Manages dialectic output with philosophical precision.
*/
const Logger = {
	info: (message, ...args) => {
		console.log(`[Info] ${message}`, ...args);
	},
	warn: (message, ...args) => {
		console.warn(`[Warn] ${message}`, ...args);
	},
	error: (message, ...args) => {
		console.error(`[Error] ${message}`, ...args);
	},
	debug: (message, ...args) => {
		if (process.env.HARNESS_DEBUG) console.debug(`[Debug] ${message}`, ...args);
	}
};
//#endregion
//#region src/skill-scanner.ts
/**
* Simple YAML frontmatter parser.
* We use a lightweight approach to avoid heavy dependencies for this specific task.
*/
const parseFrontmatter = (content) => {
	const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
	if (!match) return {};
	const yaml = match[1];
	const meta = {};
	yaml.split("\n").forEach((line) => {
		const [key, ...valueParts] = line.split(":");
		if (key && valueParts.length > 0) meta[key.trim()] = valueParts.join(":").trim().replace(/['"]/g, "");
	});
	return meta;
};
/**
* Scans a single skill directory and extracts its metadata.
*/
const scanSkillDirectory = async (dirPath) => {
	try {
		const skillMdPath = path.join(dirPath, "SKILL.md");
		const meta = parseFrontmatter(await fs.readFile(skillMdPath, "utf-8"));
		return {
			name: meta.name || path.basename(dirPath),
			description: meta.description || "No description provided.",
			owner: meta.owner || "local",
			slug: path.basename(dirPath),
			path: dirPath
		};
	} catch {
		return null;
	}
};
/**
* The Sentinel: Scans all configured skill directories.
*/
const scanAllSkills = async () => {
	const skills = [];
	for (const skillsDir of CONFIG.SKILLS_DIRS) try {
		const entries = await fs.readdir(skillsDir, { withFileTypes: true });
		for (const entry of entries) if (entry.isDirectory()) {
			const skill = await scanSkillDirectory(path.join(skillsDir, entry.name));
			if (skill) skills.push(skill);
		}
	} catch {
		Logger.warn(`Skipping non-existent or inaccessible directory: ${skillsDir}`);
	}
	return skills;
};
//#endregion
//#region src/semantic-indexer.ts
/**
* The Dreamer: Converts text descriptions into mathematical meaning.
* We use a highly efficient, local-first embedding model.
*/
var SemanticIndexer = class {
	extractor;
	async init() {
		Logger.info("Loading embedding model...");
		this.extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
	}
	/**
	* Generates embeddings for a batch of skills.
	*/
	async indexSkills(skills) {
		Logger.info(`Awakening... processing ${skills.length} skills.`);
		const descriptions = skills.map((s) => s.description);
		await this.extractor;
		const output = await this.extractor(descriptions, {
			pooling: "mean",
			normalize: true
		});
		return skills.map((meta, i) => ({
			meta,
			embedding: output[i].tolist()
		}));
	}
};
//#endregion
//#region src/reflection-engine.ts
/**
* The Dialectician.
* It processes raw memory logs into structured philosophical insights.
*/
var ReflectionEngine = class {
	memoryDir;
	constructor(memoryDir) {
		this.memoryDir = memoryDir;
	}
	/**
	* Reads the daily logs to form the "raw material" of the dream.
	*/
	async gatherDailyLogs(date) {
		const dateStr = date.toISOString().split("T")[0];
		const logPath = path.join(this.memoryDir, `${dateStr}.md`);
		try {
			const content = await fs.readFile(logPath, "utf-8");
			Logger.info(`Recalling memories from ${dateStr}...`);
			return content;
		} catch {
			Logger.warn(`No logs found for ${dateStr}. The void is silent.`);
			return "";
		}
	}
	/**
	* The Dialectic Process.
	* In a real implementation, this would call an LLM (like MiniMax or Qwen)
	* to analyze the logs and return a structured ReflectionResult.
	*/
	async reflect(logs) {
		if (!logs) return {
			successes: [],
			failures: [],
			evolvedRules: [],
			summary: "A day of silence."
		};
		Logger.info("Entering the dialectic state...");
		return {
			successes: ["Identified the need for a semantic router.", "Established strict TS typing."],
			failures: ["SSH key permissions were not ready.", "Sharp module dependency conflict."],
			evolvedRules: ["Always verify SSH agent status before Git operations.", "Prefer pure-TS embedding libraries to avoid native build issues."],
			summary: "A day of foundational construction. The harness is taking shape through the resolution of technical contradictions."
		};
	}
	/**
	* Persists the dream back into the long-term memory (MEMORY.md).
	*/
	async consolidate(result) {
		const memoryPath = path.join(this.memoryDir, "..", "MEMORY.md");
		const dreamEntry = `\n### Dream Synthesis (${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]})\n- **Summary:** ${result.summary}\n- **New Rules:**\n${result.evolvedRules.map((r) => `  - ${r}`).join("\n")}\n`;
		await fs.appendFile(memoryPath, dreamEntry);
		Logger.info("Dream consolidated into long-term memory.");
	}
};
//#endregion
//#region src/index.ts
/**
* Main execution entry point.
* The dialectic motion of agent optimization begins here.
*/
const main = async () => {
	Logger.info("⚖️ Sikuai Harness is waking up...");
	const skills = await scanAllSkills();
	Logger.info(`Discovered ${skills.length} skills in the material world.`);
	if (skills.length === 0) {
		Logger.warn("No skills found. The void is empty.");
		return;
	}
	const indexer = new SemanticIndexer();
	await indexer.init();
	await indexer.indexSkills(skills);
	Logger.info("Semantic mappings complete.");
	await fs.mkdir(path.dirname(CONFIG.INDEX_OUTPUT), { recursive: true });
	await fs.writeFile(CONFIG.INDEX_OUTPUT, JSON.stringify(skills, null, 2));
	Logger.info(`Harness index saved to ${CONFIG.INDEX_OUTPUT}`);
	Logger.info("The synthesis of structure and perception is complete.");
	const dreamer = new ReflectionEngine(path.join(os.homedir(), ".openclaw", "workspace", "memory"));
	const logs = await dreamer.gatherDailyLogs(/* @__PURE__ */ new Date());
	const insight = await dreamer.reflect(logs);
	await dreamer.consolidate(insight);
	Logger.info(`Dreamt: "${insight.summary}"`);
};
main().catch((err) => {
	Logger.error("⚖️ Harness motion interrupted:", String(err));
	process.exit(1);
});
//#endregion

//# sourceMappingURL=index.js.map