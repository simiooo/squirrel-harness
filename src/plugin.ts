import type { OpenClawPlugin } from "openclaw";
import { SkillRouter } from "./skill-router.ts";
import { DeepDreamer } from "./deep-dreamer.ts";
import { Evolver } from "./evolver.ts";
import { Logger } from "./logger.ts";

/**
 * Sikuai Harness Plugin for OpenClaw.
 * Provides semantic routing and dialectic self-evolution.
 */
export const SikuaiHarnessPlugin: OpenClawPlugin = {
  id: "sikuai-harness",
  name: "Sikuai Harness",
  description: "Semantic skill routing and dialectic agent evolution.",
  version: "1.0.0",

  async load() {
    Logger.info("⚖️ Sikuai Harness plugin loaded.");
  },

  /**
   * Tool: route-skill
   * Finds the most relevant skills for a given user intent.
   */
  tools: [
    {
      name: "route-skill",
      description: "Find the top 3 OpenClaw skills for a specific task.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The user's intent or task." },
        },
        required: ["query"],
      },
      async execute({ query }) {
        const router = new SkillRouter();
        await router.init();
        const matches = await router.route(query as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(matches, null, 2),
            },
          ],
        };
      },
    },
  ],

  /**
   * Hook: session-end
   * Triggers the "Deep Dream" and "Evolution" process when a session ends.
   */
  hooks: {
    async "session:end"({ session }) {
      if (!session.messages || session.messages.length < 5) return;

      Logger.info("Session ended. Initiating dialectic reflection...");
      
      // In a real plugin, we'd access the OpenClaw model provider here.
      // For now, we simulate the trigger for the Evolver.
      const evolver = new Evolver(process.cwd());
      await evolver.addNewRule(
        `Session ${session.id} concluded. Reflection pending.`,
      );
    },
  },
};
