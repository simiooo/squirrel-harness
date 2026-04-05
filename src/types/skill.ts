/**
 * Represents the metadata for an OpenClaw Skill.
 * This is the "Description" in our Semantic Router.
 */
export interface SkillMeta {
  name: string;
  description: string;
  owner: string;
  slug: string;
  path: string;
}

/**
 * Represents the vector embedding of a Skill.
 * This allows us to perform mathematical "Semantic Routing".
 */
export interface SkillIndex {
  meta: SkillMeta;
  embedding: Float32Array;
}
