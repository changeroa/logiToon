
import { GoogleGenAI, Type } from "@google/genai";
import {
  getCachedPrompt,
  validateLogicOutput,
  validateStoryOutput,
  validateVisualOutput,
  getLogicSchema,
  getStorySchema,
  getVisualSchema,
  STYLE_LIBRARY,
  AGE_GROUPS,
  type PromptConfig,
} from "../prompts";

// --- Types ---
import {
  StoryResponse,
  Panel,
  StylePresetId,
  GenerationConfig,
  ConceptPlan,
  DraftScript
} from "../types";

// --- AI Client ---
const getClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Smart Rate Limiter ---
type QuotaCategory = 'TEXT_FLASH' | 'IMAGE_FLASH';

class SmartRateLimiter {
  private lastCallTimes: Record<QuotaCategory, number> = {
    'TEXT_FLASH': 0,
    'IMAGE_FLASH': 0,
  };

  private minIntervals: Record<QuotaCategory, number> = {
    'TEXT_FLASH': 500,
    'IMAGE_FLASH': 0, 
  };

  async wait(category: QuotaCategory): Promise<void> {
    const now = Date.now();
    const lastTime = this.lastCallTimes[category];
    const interval = this.minIntervals[category];

    const timeSinceLast = now - lastTime;

    if (timeSinceLast < interval) {
      const waitTime = interval - timeSinceLast;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastCallTimes[category] = Date.now();
  }
}

const rateLimiter = new SmartRateLimiter();

// --- Helper: Convert GenerationConfig to PromptConfig ---
const toPromptConfig = (config: GenerationConfig, language: string = 'en'): PromptConfig => ({
  ageGroup: config.ageGroup,
  tone: config.tone,
  character: config.characterType,
  style: config.styleId,
  language
});

// --- Helper: Extract JSON from text ---
// Finds the first '{' or '[' and the last '}' or ']' to isolate the JSON block
function extractJSON(text: string): string | null {
  // 1. Try to find markdown code blocks first (most reliable)
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // 2. Find the outermost braces/brackets
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  
  let startIdx = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx === -1) return null;

  const lastBrace = text.lastIndexOf('}');
  const lastBracket = text.lastIndexOf(']');
  
  const endIdx = Math.max(lastBrace, lastBracket);

  if (endIdx === -1 || endIdx < startIdx) return null;

  return text.substring(startIdx, endIdx + 1);
}

// --- Robust JSON Parser ---
const safeParseJSON = (text: string): any => {
  if (!text || typeof text !== 'string') {
    return {};
  }

  // === Stage 0: Basic Cleanup ===
  // Remove BOM and zero-width spaces
  let processed = text.replace(/^\uFEFF|\u200B/g, '').trim();

  // === Stage 1: Direct Parse & Recursive Unwrap ===
  try {
    let result = JSON.parse(processed);
    
    // Handle cases where the model returns a stringified JSON string (Double encoded)
    // e.g., "{\"key\": \"value\"}" -> {"key": "value"}
    if (typeof result === 'string') {
       try {
         const inner = JSON.parse(result);
         // If unwrapping yields an object, use it. Otherwise keep original string (might be intended).
         if (typeof inner === 'object' && inner !== null) {
           result = inner;
         }
       } catch {
         // Failed to parse inner string, keep result as is for now
       }
    }
    return result;
  } catch (e) {
    // Continue to extraction
  }

  // === Stage 2: Extract JSON substring ===
  const extracted = extractJSON(processed);
  if (extracted) {
    try {
      let result = JSON.parse(extracted);
      // Check double encoding again for extracted content
      if (typeof result === 'string') {
         try {
            const inner = JSON.parse(result);
            if (typeof inner === 'object' && inner !== null) {
              result = inner;
            }
         } catch {}
      }
      return result;
    } catch (e) {
       console.warn("[JSON Parse] Extraction failed, trying repair...");
    }
  }

  // === Stage 3: Last Resort Cleanup ===
  if (extracted) {
      try {
          // Fix trailing commas: { "a": 1, } -> { "a": 1 }
          // Use simple regex replacement for trailing commas before } or ]
          const fixed = extracted.replace(new RegExp(',\\s*([}\\]])', 'g'), '$1');
          return JSON.parse(fixed);
      } catch(e) {}
  }

  console.error('=== JSON PARSE FAILURE ===');
  console.error('Input preview:', text.substring(0, 200));
  
  // Return empty object instead of throwing to prevent app crash
  return {}; 
};

// --- Helper: Force object type (Safety Net) ---
// This ensures that we NEVER get a string, array, or null when we expect an object.
const ensureObject = (data: any): any => {
  if (typeof data !== 'object' || data === null || Array.isArray(data) || data instanceof String) {
    console.warn("ensureObject: Input was not a valid object, returning empty object. Input type:", typeof data);
    return {};
  }
  return data;
};

// --- Pipeline Stages ---

// Stage 1: Logic Agent
const runLogicAgent = async (topic: string, config: GenerationConfig): Promise<ConceptPlan> => {
  const ai = getClient();
  await rateLimiter.wait('TEXT_FLASH');

  const promptConfig = toPromptConfig(config);
  const systemInstruction = getCachedPrompt(promptConfig, 'logic');

  const ageConfig = AGE_GROUPS[config.ageGroup];
  const userPrompt = `
TOPIC: "${topic}"
AUDIENCE: ${ageConfig.label}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      // Removed incorrect toGeminiSchema wrapper
      responseSchema: getLogicSchema(),
    },
  });

  const text = response.text || "";
  let parsed = safeParseJSON(text);

  // CRITICAL: Ensure we have an object before property access
  parsed = ensureObject(parsed);

  if (!parsed.forbidden_words || !Array.isArray(parsed.forbidden_words)) {
    parsed.forbidden_words = [];
  }

  try {
    validateLogicOutput(parsed);
  } catch (error) {
    console.warn("Logic output validation warning:", error);
  }

  return parsed as ConceptPlan;
};

// Stage 2: Story Agent
const runStoryAgent = async (topic: string, plan: ConceptPlan, config: GenerationConfig): Promise<DraftScript> => {
  const ai = getClient();
  await rateLimiter.wait('TEXT_FLASH');

  const promptConfig = toPromptConfig(config, plan.detected_language);
  const systemInstruction = getCachedPrompt(promptConfig, 'story');

  const forbiddenWords = Array.isArray(plan.forbidden_words) ? plan.forbidden_words.join(", ") : "";

  const userPrompt = `
TOPIC: ${topic}
LANGUAGE: ${plan.detected_language}

LOGIC BLUEPRINT:
- Core Truth: ${plan.core_truth}
- Analogy Model: ${plan.analogy_model}
- Metaphor Needed: ${plan.is_metaphor_needed ? 'Yes' : 'No'}
- Forbidden Words: ${forbiddenWords}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      // Removed incorrect toGeminiSchema wrapper
      responseSchema: getStorySchema(),
    },
  });

  const text = response.text || "";
  let parsed = safeParseJSON(text);
  
  parsed = ensureObject(parsed);

  try {
    validateStoryOutput(parsed);
  } catch (error) {
    console.warn("Story output validation warning:", error);
  }

  if (!parsed.panels_text || !Array.isArray(parsed.panels_text)) {
    console.error("Critical: panels_text missing or invalid in Story Agent response", parsed);
    throw new Error("Story Agent failed to generate valid panel script.");
  }

  return parsed as DraftScript;
};

// Stage 3: Visual Agent
const runVisualAgent = async (script: DraftScript, config: GenerationConfig): Promise<StoryResponse> => {
  const ai = getClient();
  await rateLimiter.wait('TEXT_FLASH');

  if (!script || !Array.isArray(script.panels_text)) {
    throw new Error("Invalid draft script provided to Visual Agent: Missing panels.");
  }

  const promptConfig = toPromptConfig(config);
  const systemInstruction = getCachedPrompt(promptConfig, 'visual');

  const userPrompt = `
SCRIPT TO VISUALIZE:
${JSON.stringify(script.panels_text, null, 2)}

CHARACTER TYPE: ${config.characterType}
STYLE: ${config.styleId}

CRITICAL INSTRUCTIONS FOR CONTINUITY:
1. **LOCATION MANAGEMENT**: You must define a specific 'location' string for EACH panel.
   - If the scene is the same as the previous panel, the 'location' string must be IDENTICAL.
   - Only change the 'location' string if the narrative explicitly moves to a new place.
2. **CHARACTER CONSISTENCY**: Ensure 'main_character_prompt' is detailed enough to look identical in every shot.

OUTPUT: Provide ONLY the JSON object.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      // Removed incorrect toGeminiSchema wrapper
      responseSchema: getVisualSchema(),
    },
  });

  const text = response.text || "";
  let visualData = safeParseJSON(text);
  
  visualData = ensureObject(visualData);

  try {
    validateVisualOutput(visualData);
  } catch (error) {
    console.warn("Visual output validation warning:", error);
  }

  const visualPanels = Array.isArray(visualData?.panels) ? visualData.panels : [];

  const mergedPanels: Panel[] = script.panels_text.map((txtPanel, index) => {
    const visPanel = visualPanels.find((p: any) => p.panel_id === txtPanel.panel_id) || visualPanels[index];

    return {
      panel_id: txtPanel.panel_id,
      speaker: txtPanel.speaker || '',
      narrative: txtPanel.narrative,
      shot_type: visPanel?.shot_type || "Wide Shot",
      composition: visPanel?.composition || "Rule of Thirds",
      location: visPanel?.location || visualData.setting || "A magical world", // Fallback
      lighting_mood: visPanel?.lighting_mood || "Warm Golden Hour",
      visual_prompt: visPanel?.visual_prompt || `A cute ${config.characterType} interacting with ${script.topic_summary}`,
      imageUrl: undefined
    };
  });

  return {
    title: script.title,
    topic_summary: script.topic_summary,
    target_age: config.ageGroup,
    language: "en",
    style_preset: config.styleId,
    character_anchor: visualData.character_anchor || '',
    setting: visualData.setting || '',
    color_palette: visualData.color_palette || '',
    main_character_prompt: visualData.main_character_prompt || '',
    metaphor_explanation: script.topic_summary,
    panels: mergedPanels,
    educational_content: {
      summary: script.educational_summary
    }
  } as StoryResponse;
};

// --- Main Pipeline Orchestrator ---
export const generateStory = async (topic: string, config: GenerationConfig): Promise<StoryResponse> => {
  console.log("--- PIPELINE START ---");

  // Stage 1: Logic
  console.log("[1/3] Epistemologist Working...");
  const conceptPlan = await runLogicAgent(topic, config);

  // Stage 2: Story
  console.log("[2/3] Author Writing...");
  const draftScript = await runStoryAgent(topic, conceptPlan, config);

  // Stage 3: Visuals
  console.log("[3/3] Cinematographer Directing...");
  let finalStory = await runVisualAgent(draftScript, config);

  finalStory.language = conceptPlan.detected_language;

  console.log("--- PIPELINE COMPLETE (No Critic) ---");
  return finalStory;
};

// --- Image Generation with Retry ---
const generateSingleImageWithRetry = async (ai: GoogleGenAI, prompt: string, retries = 3): Promise<string | undefined> => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("Gemini returned text/refusal.");
    } catch (error: any) {
      attempts++;
      
      // Check for 429 Resource Exhausted or 5xx Server Errors
      const errorMessage = error?.message || "";
      const isRateLimit = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");
      const isServerOverload = errorMessage.includes("503") || errorMessage.includes("500");

      if (isRateLimit || isServerOverload) {
        if (attempts >= retries) throw error; // Give up
        
        const delay = 2000 * Math.pow(2, attempts); // Exponential backoff: 4s, 8s, 16s...
        console.warn(`[Image Gen] Hit rate limit/error (Attempt ${attempts}/${retries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
         // Fallback to Imagen immediately for other errors (e.g. refusal)
         console.warn(`[Image Gen] Gemini Flash failed (Attempt ${attempts}), trying Imagen fallback...`);
         try {
            const response = await ai.models.generateImages({
              model: 'imagen-4.0-generate-001',
              prompt: prompt,
              config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
                outputMimeType: 'image/png'
              }
            });
            const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
            if (imageBytes) return `data:image/png;base64,${imageBytes}`;
         } catch (imagenError) {
            console.error(`Imagen fallback also failed:`, imagenError);
         }
         
         if (attempts >= retries) throw error;
      }
    }
  }
  return undefined;
};

// --- Image Generation ---
export const generateComicImages = async (story: StoryResponse): Promise<string[]> => {
  const ai = getClient();
  const styleConfig = STYLE_LIBRARY[story.style_preset as StylePresetId] || STYLE_LIBRARY['3d-clay'];

  if (!story || !Array.isArray(story.panels) || story.panels.length === 0) {
    throw new Error("Invalid story structure: missing panels for image generation.");
  }

  const results: string[] = new Array(story.panels.length).fill("");
  const totalPanels = story.panels.length;
  // Reduced batch size to 2 to avoid 429 errors
  const BATCH_SIZE = 2; 

  for (let i = 0; i < totalPanels; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE, totalPanels);
    const batch = story.panels.slice(i, batchEnd);
    
    console.log(`Generating images for panels ${i + 1} to ${batchEnd} (Batch ${Math.floor(i/BATCH_SIZE) + 1})...`);

    // Process batch in parallel
    await Promise.all(batch.map(async (panel, index) => {
      const globalIndex = i + index;
      
      const locationPrompt = panel.location ? panel.location : story.setting;

      const imagePrompt = `
Generate a SINGLE high-quality cinematic illustration (1:1 aspect ratio).

=== 1. ART DIRECTION ===
**STYLE PROMPT**: ${styleConfig.prompt}
**PALETTE**: ${story.color_palette}
**SETTING/LOCATION**: ${locationPrompt}
**MAIN CHARACTER**: ${story.main_character_prompt} (Ensure Character Consistency!)

=== 2. SCENE DETAILS (Panel ${panel.panel_id}) ===
**COMPOSITION**: ${panel.shot_type}, ${panel.composition}
**LIGHTING**: ${panel.lighting_mood}
**ACTION/CONTENT**: ${panel.visual_prompt}

=== 3. NEGATIVE PROMPT ===
text, speech bubbles, word balloons, watermark, letters, numbers, digits, panel numbers, white borders, comic book frames, gutters, dividers, blur, low quality, distortion, ugly, split screen, multiple panels, grid.
`;

      const imageUrl = await generateSingleImageWithRetry(ai, imagePrompt);
      if (imageUrl) {
        results[globalIndex] = imageUrl;
      }
    }));

    if (batchEnd < totalPanels) {
      // Increased delay to 2500ms to be safer
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
  }

  return results;
};
