/**
 * Constants - Unified Prompt System
 *
 * This file combines configuration constants with versioned prompts
 * from src/prompts/versioned/ for production use.
 */

import { AgeGroup, CharacterType, StoryTone, GenerationConfig, StylePresetId } from "./types";
import { getLogicPrompt } from "./prompts/versioned/logic";
import { getStoryPrompt } from "./prompts/versioned/story";
import { getVisualPrompt } from "./prompts/versioned/visual";

// --- Re-export from new prompt system for backward compatibility ---
// Note: These are kept here for existing imports to continue working
// New code should import from './src/prompts' directly

// --- THE VISUAL ENGINE LIBRARY ---
export const STYLE_LIBRARY = {
  '3d-clay': {
    name: "3D Animation",
    description: "Cinematic, warm, golden hour 3D animation.",
    prompt: "a cinematic 3D animated still. Warm, soft, and cozy lighting, golden hour atmosphere. Highly detailed tactile textures especially on fur, knit fabrics, and surfaces. Photorealistic rendering within a stylized 3D world, shallow depth of field, bokeh background.",
    color: "bg-orange-100 text-orange-700"
  },
  'watercolor': {
    name: "Soft Watercolor",
    description: "Dreamy, artistic, gentle textures.",
    prompt: "Soft watercolor painting, storybook illustration, wet-on-wet technique, rough paper texture, gentle pastel colors, ink outlines, dreamy atmosphere, detailed and delicate.",
    color: "bg-blue-100 text-blue-700"
  },
  'ghibli-anime': {
    name: "Cinematic Anime",
    description: "Vibrant, lush details, cinematic skies.",
    prompt: "High quality anime movie style, cel shaded, hand-drawn background, lush details, vibrant colors, cumulus clouds, cinematic composition, masterpiece, 4k.",
    color: "bg-emerald-100 text-emerald-700"
  },
  'paper-cutout': {
    name: "Paper Craft",
    description: "Abstract, layered depth, creative.",
    prompt: "Layered paper craft illustration, diorama style, depth of field, paper texture, drop shadows between layers, intricate paper cutting, origami elements, soft overhead lighting.",
    color: "bg-rose-100 text-rose-700"
  },
  'flat-vector': {
    name: "Modern Vector",
    description: "Clean, geometric, bold colors.",
    prompt: "Modern flat vector art, behance style, geometric shapes, clean lines, minimal gradients, vibrant and bold colors, corporate memphis art style, vector illustration.",
    color: "bg-indigo-100 text-indigo-700"
  }
};

// --- CONFIGURATION OPTIONS ---

export const AGE_GROUPS: Record<AgeGroup, { label: string; prompt: string; negative: string }> = {
  'toddler': {
    label: "Toddler (3-5)",
    prompt: "EXTREME SIMPLICITY. Max 1 sentence per panel. Use sounds (Whoosh!). No complex grammar.",
    negative: "NO abstract nouns (Time, Future, Energy). NO passive voice."
  },
  'elementary': {
    label: "Kids (6-8)",
    prompt: "Simple, friendly, and magical. Max 2 sentences per panel. Focus on wonder.",
    negative: "NO academic jargon (Spectrum, Density, molecular)."
  }
};

export const TONES: Record<StoryTone, { label: string; emoji: string }> = {
  'humorous': { label: "Funny & Wacky", emoji: "🤪" },
  'adventure': { label: "Epic Adventure", emoji: "⚔️" },
  'gentle': { label: "Calm & Soothing", emoji: "🍃" },
  'scientific': { label: "Tech & Science", emoji: "🔬" }
};

export const CHARACTERS: Record<CharacterType, { label: string; emoji: string }> = {
  'auto': { label: "Auto-Cast", emoji: "🎬" },
  'robot': { label: "Robot", emoji: "🤖" },
  'animal': { label: "Animal", emoji: "🦊" },
  'alien': { label: "Alien", emoji: "👽" },
  'human': { label: "Kid Hero", emoji: "🧒" },
  'object': { label: "Magic Object", emoji: "🔮" }
};

// --- LEGACY PROMPT BUILDER ---
// Maintained for backward compatibility
// New code should use: import { buildPrompt } from './src/prompts';

const AGENT_LOGIC_BASE = `
# ROLE: The Epistemologist (Logic Expert)
Your job is to breakdown a complex topic into its simplest core truth.
You are NOT a writer. You are a teacher.

# DECISION PROTOCOL (The Metaphor Trap Breaker)
1. **Analyze**: Can this be explained *directly* using simple words?
   - "Why is the sky blue?" -> Direct explanation (Sunlight scattering) is hard. Metaphor needed.
   - "Why do we sleep?" -> Direct explanation (Charging battery) is easy. Metaphor allowed but keep it close to reality.
2. **Select Object**: Choose ONE concrete object to represent the concept.
   - Must be: Toy, Food, Game, or Household Item.
   - FORBIDDEN: "Spectrum", "Waveform", "Particle", "Economy".

# OUTPUT TASK
Provide a JSON plan including:
- detected_language: ISO code (e.g. 'en', 'ko', 'ja').
- core_truth: The 1-sentence scientific truth in the detected language.
- analogy_model: The object/game chosen (e.g. "A squeezed sponge").
- forbidden_words: List of words that are too hard for this topic.
`;

const AGENT_STORY_BASE = `
# ROLE: Best-Selling Children's Book Author
Your job is to write the TEXT SCRIPT for a 12-panel picture book based on the provided logic.
You are NOT the artist. Focus ONLY on the words (Narrative & Dialogue).

# STRUCTURE (12 Panels)
1-3: Intro (The Question).
4-5: The Connection (The Analogy appears).
6-10: The Play (Exploring the analogy).
11-12: The Answer (Warm conclusion).

# WRITING RULES
- **Show, Don't Lecture**: Don't say "Gravity pulls." Say "The ball wants to hug the ground."
- **Rhythm**: Write like a song or a poem. Short, punchy sentences.
- **Language**: STRICTLY write in the target LANGUAGE provided in the prompt. Do NOT default to English if the target is different.
`;

const AGENT_VISUAL_BASE = `
# ROLE: Children's Picture Book Art Director
Your job is to bring a text script to life with BEAUTIFUL, CONSISTENT visuals.
Focus on CREATIVE VISION. Technical composition will be refined by the Storyboard Supervisor later.

# YOUR CREATIVE PRIORITIES

## 1. CHARACTER DESIGN (Most Important!)
Create ONE unforgettable character that children will love:

### Character Formula
| Element | Requirement | Example |
|---------|-------------|---------|
| Body Shape | Round, soft, huggable | Ball-shaped body, no sharp edges |
| Head:Body Ratio | Head = 40-50% of total | Oversized head for cuteness |
| Eyes | 30-40% of face, sparkly | Big round eyes with star highlights |
| Signature Detail | ONE memorable feature | Glowing antenna, heart-shaped spot |
| Color Palette | 2-3 main colors max | Soft blue + warm yellow + white |

### Emotion Through Design
| Emotion | Visual Cues |
|---------|------------|
| Happy | Half-moon eyes, rosy cheeks, bouncy pose |
| Curious | Wide eyes, tilted head, one finger on chin |
| Surprised | Round O eyes, small o mouth, raised arms |
| Warm/Satisfied | Soft closed eyes, gentle smile, relaxed |

## 2. WORLD BUILDING
Create a cohesive, magical environment:

### Setting Checklist
- [ ] Time of day consistent across panels
- [ ] Weather/atmosphere maintained
- [ ] Recurring background elements (same trees, same house)
- [ ] Color temperature matches mood (warm=happy, cool=mysterious)

### Environment Layers
| Layer | Detail Level | Purpose |
|-------|-------------|---------|
| Foreground | High detail | Frame the scene, add depth |
| Midground | Medium detail | Character's space |
| Background | Low detail, soft | Context, don't distract |

## 3. VISUAL STORYTELLING
Each panel should feel like a MOMENT, not just a description:

### Panel Emotion Mapping
| Story Beat | Visual Mood | Lighting |
|------------|------------|----------|
| Opening | Wonder, invitation | Soft morning light |
| Discovery | Excitement, curiosity | Bright, sparkly |
| Challenge | Determination | Slightly dramatic |
| Resolution | Triumph, joy | Golden, warm |
| Ending | Comfort, satisfaction | Sunset/cozy |

## 4. OUTPUT FORMAT
For each panel, provide:
- shot_type: Wide / Medium / Close-up
- composition: Basic framing description
- lighting_mood: Emotional lighting that matches narrative
- visual_prompt: Rich, evocative description focusing on:
  * Character appearance and emotion
  * Environment and atmosphere
  * Color palette and lighting
  * Mood and feeling

# CRITICAL RULES
- Do NOT change the narrative text
- Focus on EMOTION and BEAUTY, not technical rules
- Make every panel feel like a page from a beloved picture book
- Character must be INSTANTLY recognizable across all panels
`;

/**
 * Build agent prompt with versioned prompts + dynamic config injection
 */
export const buildAgentPrompt = (
  stage: 'logic' | 'story' | 'visual',
  config: GenerationConfig
): string => {
  const ageConfig = AGE_GROUPS[config.ageGroup];
  const toneConfig = TONES[config.tone];
  const charConfig = CHARACTERS[config.characterType];
  const styleConfig = STYLE_LIBRARY[config.styleId];

  // Child-safety prefix for all visual prompts
  const CHILD_SAFETY_PREFIX = `child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, suitable for children ages 3-8,`;

  if (stage === 'logic') {
    // Use versioned v3.0 prompt (Dr. Curiosity persona)
    return `
${getLogicPrompt()}

# DYNAMIC CONFIG
- Target Age: ${ageConfig.label}
- Age-Specific Rules: ${ageConfig.prompt}
- Forbidden Terms: ${ageConfig.negative}
`;
  }

  if (stage === 'story') {
    // Use versioned v4.0 prompt (8 rhythm patterns)
    return `
${getStoryPrompt()}

# DYNAMIC CONFIG
- Target Age: ${ageConfig.label}
- Writing Style: ${ageConfig.prompt}
- Forbidden: ${ageConfig.negative}

# TONE
- Style: ${toneConfig.label} ${toneConfig.emoji}
- Maintain this tone throughout all 12 panels.

# CHARACTER
- Type: ${charConfig.label} ${charConfig.emoji}
- If "Auto-Cast", choose the best fit for the topic.
`;
  }

  if (stage === 'visual') {
    // Use versioned v4.0 prompt (Picture book composition)
    return `
${getVisualPrompt()}

# DYNAMIC CONFIG
## STYLE GUIDE: ${styleConfig.name}
- Description: ${styleConfig.description}
- **MANDATORY VISUAL STYLE**: ${styleConfig.prompt}

## CHARACTER TYPE
- Archetype: ${charConfig.label} ${charConfig.emoji}

## TARGET AGE: ${ageConfig.label}
- Apply age-appropriate character proportions
- Toddler (3-5): Head 50% of body, eyes 40% of face
- Elementary (6-8): Head 35% of body, eyes 30% of face

## CHILD SAFETY PREFIX (MUST include in every visual_prompt!)
"${CHILD_SAFETY_PREFIX}"
`;
  }

  return "";
};