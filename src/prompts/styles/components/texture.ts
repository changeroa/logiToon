// Reusable texture component definitions for visual prompts

export const TEXTURE = {
  'tactile': 'highly detailed tactile textures on fur, fabric, and surfaces',
  'smooth': 'smooth clean surfaces, minimal texture detail, polished',
  'rough': 'rough paper texture, visible brush strokes, organic feel',
  'grainy': 'film grain texture, vintage aesthetic, subtle noise',
  'glossy': 'glossy reflective surfaces, wet look, high shine',
  'matte': 'matte finish, soft surfaces, no reflections',
  'fabric': 'visible fabric weave, cloth texture, soft material detail',
  'paper': 'paper texture, slight imperfections, handcrafted feel'
} as const;

export type TextureKey = keyof typeof TEXTURE;

export const getTexture = (key: TextureKey): string => TEXTURE[key];
