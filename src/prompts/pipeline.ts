
import { PromptConfig } from './types';
import { PromptBuilder } from './builder';
import {
  LogicOutput,
  StoryOutput,
  VisualOutput,
  validateLogicOutput,
  validateStoryOutput,
  validateVisualOutput
} from './schemas';
import {
  validateStoryText,
  validateVisualPrompt,
  autoCorrectText,
  ValidationResult
} from './validators';
import { Type } from '@google/genai';

/**
 * Pipeline context that flows through all stages
 */
export interface PipelineContext {
  topic: string;
  config: PromptConfig;
  logicResult?: LogicOutput;
  storyResult?: StoryOutput;
  visualResult?: VisualOutput;
  errors: string[];
  // 검증 결과 추가
  validationResults?: {
    story?: ValidationResult;
    visual?: ValidationResult[];
  };
}

/**
 * Pipeline stage function type
 */
export type PipelineStage<T = void> = (
  ctx: PipelineContext,
  callAI: AICallFunction
) => Promise<PipelineContext>;

/**
 * AI call function type - to be injected by the service layer
 */
export type AICallFunction = (
  systemPrompt: string,
  userPrompt: string,
  schema: object
) => Promise<unknown>;

/**
 * Progress callback for UI updates
 */
export type ProgressCallback = (stage: string, message: string) => void;

// --- Pipeline Stages ---

/**
 * Stage 1: Logic - Break down the topic into core truth and analogy
 */
export const logicStage: PipelineStage = async (ctx, callAI) => {
  const builder = new PromptBuilder(ctx.config);
  const systemPrompt = builder.build('logic');

  const userPrompt = `
TOPIC: "${ctx.topic}"
AUDIENCE: ${ctx.config.ageGroup}
`;

  try {
    const result = await callAI(systemPrompt, userPrompt, getLogicSchema());
    const validated = validateLogicOutput(result);
    return { ...ctx, logicResult: validated };
  } catch (error) {
    return {
      ...ctx,
      errors: [...ctx.errors, `Logic stage failed: ${error}`]
    };
  }
};

/**
 * Stage 2: Story - Write the narrative based on logic output
 * 아동 안전 검증 레이어 포함
 */
export const storyStage: PipelineStage = async (ctx, callAI) => {
  if (!ctx.logicResult) {
    return {
      ...ctx,
      errors: [...ctx.errors, 'Story stage requires logic result']
    };
  }

  const builder = new PromptBuilder(ctx.config);
  const systemPrompt = builder.build('story');

  const userPrompt = `
TOPIC: ${ctx.topic}
LANGUAGE: ${ctx.logicResult.detected_language}

LOGIC BLUEPRINT:
- Core Truth: ${ctx.logicResult.core_truth}
- Analogy Model: ${ctx.logicResult.analogy_model}
- Metaphor Needed: ${ctx.logicResult.is_metaphor_needed ? 'Yes' : 'No'}
- Forbidden Words: ${ctx.logicResult.forbidden_words.join(', ')}
`;

  try {
    const result = await callAI(systemPrompt, userPrompt, getStorySchema());
    let validated = validateStoryOutput(result);

    // 🛡️ 아동 안전 검증 레이어
    const allNarratives = validated.panels_text.map(p => p.narrative).join(' ');
    const safetyValidation = validateStoryText(allNarratives, ctx.config.ageGroup);

    // 위험한 표현 자동 수정 시도
    if (!safetyValidation.passed) {
      console.warn('[Child Safety] 스토리 검증 실패, 자동 수정 시도...');

      // 각 패널의 narrative 자동 수정
      const correctedPanels = validated.panels_text.map(panel => {
        const { corrected, changes } = autoCorrectText(panel.narrative);
        if (changes.length > 0) {
          console.log(`[패널 ${panel.panel_id}] 수정: ${changes.join(', ')}`);
        }
        return { ...panel, narrative: corrected };
      });

      validated = { ...validated, panels_text: correctedPanels };

      // 수정 후 재검증
      const revalidation = validateStoryText(
        correctedPanels.map(p => p.narrative).join(' '),
        ctx.config.ageGroup
      );

      // 여전히 실패하면 경고 추가 (하지만 진행은 계속)
      if (!revalidation.passed) {
        console.error('[Child Safety] 자동 수정 후에도 검증 실패');
        ctx.errors.push(`스토리 안전 검증 경고: ${revalidation.issues.map(i => i.message).join(', ')}`);
      }

      return {
        ...ctx,
        storyResult: validated,
        validationResults: {
          ...ctx.validationResults,
          story: revalidation
        }
      };
    }

    return {
      ...ctx,
      storyResult: validated,
      validationResults: {
        ...ctx.validationResults,
        story: safetyValidation
      }
    };
  } catch (error) {
    return {
      ...ctx,
      errors: [...ctx.errors, `Story stage failed: ${error}`]
    };
  }
};

/**
 * Stage 3: Visual - Create visual directions for each panel
 * 아동 안전 비주얼 검증 레이어 포함
 */
export const visualStage: PipelineStage = async (ctx, callAI) => {
  if (!ctx.storyResult) {
    return {
      ...ctx,
      errors: [...ctx.errors, 'Visual stage requires story result']
    };
  }

  const builder = new PromptBuilder(ctx.config);
  const systemPrompt = builder.build('visual');

  const userPrompt = `
SCRIPT TO VISUALIZE (Do not change the text, only provide visuals):
${JSON.stringify(ctx.storyResult.panels_text, null, 2)}

CHARACTER TYPE: ${ctx.config.character}
STYLE: ${ctx.config.style}
`;

  try {
    const result = await callAI(systemPrompt, userPrompt, getVisualSchema());
    let validated = validateVisualOutput(result);

    // 🛡️ 아동 안전 비주얼 검증 레이어
    const visualValidations: ValidationResult[] = [];
    let hasUnsafeVisuals = false;

    // 각 패널의 visual_prompt 검증
    const safePanels = validated.panels.map(panel => {
      const validation = validateVisualPrompt(panel.visual_prompt);
      visualValidations.push(validation);

      if (!validation.passed) {
        hasUnsafeVisuals = true;
        console.warn(`[Child Safety] 패널 ${panel.panel_id} 비주얼 검증 실패:`, validation.issues);

        // 안전 접두사 강제 추가
        const safePrompt = ensureChildSafePrefix(panel.visual_prompt);
        return { ...panel, visual_prompt: safePrompt };
      }

      return panel;
    });

    if (hasUnsafeVisuals) {
      console.warn('[Child Safety] 일부 비주얼 프롬프트가 수정되었습니다');
      validated = { ...validated, panels: safePanels };
    }

    // main_character_prompt도 검증
    if (validated.main_character_prompt) {
      const charValidation = validateVisualPrompt(validated.main_character_prompt);
      if (!charValidation.passed) {
        validated = {
          ...validated,
          main_character_prompt: ensureChildSafePrefix(validated.main_character_prompt)
        };
      }
    }

    return {
      ...ctx,
      visualResult: validated,
      validationResults: {
        ...ctx.validationResults,
        visual: visualValidations
      }
    };
  } catch (error) {
    return {
      ...ctx,
      errors: [...ctx.errors, `Visual stage failed: ${error}`]
    };
  }
};

/**
 * 비주얼 프롬프트에 아동 안전 접두사를 강제로 추가합니다
 */
const ensureChildSafePrefix = (prompt: string): string => {
  const CHILD_SAFE_PREFIX = 'child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, no scary elements,';

  // 이미 접두사가 있으면 그대로 반환
  if (prompt.toLowerCase().includes('child-friendly')) {
    return prompt;
  }

  // 위험한 키워드 제거
  const dangerousKeywords = [
    'scary', 'dark shadow', 'creepy', 'horror', 'blood', 'sharp teeth',
    'claws', 'fangs', 'evil', 'demon', 'monster', 'nightmare', 'threatening'
  ];

  let safePrompt = prompt;
  for (const keyword of dangerousKeywords) {
    safePrompt = safePrompt.replace(new RegExp(keyword, 'gi'), '');
  }

  return `${CHILD_SAFE_PREFIX} ${safePrompt.trim()}`;
};

// --- Pipeline Orchestration ---

/**
 * Default pipeline stages in order
 */
export const DEFAULT_PIPELINE: PipelineStage[] = [
  logicStage,
  storyStage,
  visualStage
];

/**
 * Run the complete story generation pipeline
 */
export const runPipeline = async (
  topic: string,
  config: PromptConfig,
  callAI: AICallFunction,
  onProgress?: ProgressCallback
): Promise<PipelineContext> => {
  let ctx: PipelineContext = {
    topic,
    config,
    errors: []
  };

  const stages = [
    { fn: logicStage, name: 'Logic', message: 'Analyzing topic...' },
    { fn: storyStage, name: 'Story', message: 'Writing narrative...' },
    { fn: visualStage, name: 'Visual', message: 'Directing visuals...' }
  ];

  for (const stage of stages) {
    onProgress?.(stage.name, stage.message);

    ctx = await stage.fn(ctx, callAI);

    // Stop pipeline if errors occurred
    if (ctx.errors.length > 0) {
      break;
    }
  }

  return ctx;
};

/**
 * Run only specific stages of the pipeline
 */
export const runPartialPipeline = async (
  ctx: PipelineContext,
  stages: PipelineStage[],
  callAI: AICallFunction
): Promise<PipelineContext> => {
  let currentCtx = ctx;

  for (const stage of stages) {
    currentCtx = await stage(currentCtx, callAI);

    if (currentCtx.errors.length > 0) {
      break;
    }
  }

  return currentCtx;
};

// --- Schema Definitions (for Gemini) ---

export const getLogicSchema = () => ({
  type: Type.OBJECT,
  properties: {
    detected_language: { type: Type.STRING },
    core_truth: { type: Type.STRING },
    analogy_model: { type: Type.STRING },
    is_metaphor_needed: { type: Type.BOOLEAN },
    forbidden_words: { type: Type.ARRAY, items: { type: Type.STRING } },
    safety_note: { type: Type.STRING } 
  },
  required: ['detected_language', 'core_truth', 'analogy_model', 'forbidden_words']
});

export const getStorySchema = () => ({
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    topic_summary: { type: Type.STRING },
    panels_text: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          panel_id: { type: Type.INTEGER },
          speaker: { type: Type.STRING },
          narrative: { type: Type.STRING },
          rhythm_pattern: { type: Type.STRING } 
        },
        required: ['panel_id', 'narrative']
      }
    },
    educational_summary: { type: Type.STRING },
    safety_check: { type: Type.STRING }
  },
  required: ['title', 'topic_summary', 'panels_text', 'educational_summary']
});

export const getVisualSchema = () => ({
  type: Type.OBJECT,
  properties: {
    target_age: { type: Type.STRING },
    style_preset: { type: Type.STRING },
    character_anchor: { type: Type.STRING },
    setting: { type: Type.STRING },
    color_palette: { type: Type.STRING },
    main_character_prompt: { type: Type.STRING },
    panels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          panel_id: { type: Type.INTEGER },
          shot_type: { type: Type.STRING },
          composition: { type: Type.STRING },
          lighting_mood: { type: Type.STRING },
          location: { type: Type.STRING },
          visual_prompt: { type: Type.STRING },
          cinematic_reason: { type: Type.STRING }
        },
        required: ['panel_id', 'shot_type', 'composition', 'lighting_mood', 'visual_prompt']
      }
    }
  },
  required: ['style_preset', 'character_anchor', 'panels']
});
