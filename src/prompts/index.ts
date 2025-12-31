
/**
 * Logitoon Prompt System
 */

// --- Types ---
export * from './types';

// --- Configuration ---
export {
  AGE_GROUPS,
  getAgeGroupConfig,
  TONES,
  getToneConfig,
  getToneDirective,
  CHARACTERS,
  getCharacterConfig,
  getCharacterGuideline
} from './config';

// --- Styles ---
export {
  STYLE_LIBRARY,
  getStyleConfig,
  getStylePrompt,
  getAvailableStyles,
  // Style components
  LIGHTING,
  TEXTURE,
  CAMERA
} from './styles';

// --- Constraints ---
export {
  FORBIDDEN_BY_AGE,
  FORBIDDEN_BY_TOPIC,
  buildForbiddenWords,
  getForbiddenWordsDirective,
  getOutputLimits,
  getOutputLimitsDirective
} from './constraints';

// --- Schemas (Zod Validation) ---
export {
  LogicOutputSchema,
  validateLogicOutput,
  safeValidateLogicOutput,
  StoryOutputSchema,
  validateStoryOutput,
  safeValidateStoryOutput,
  VisualOutputSchema,
  validateVisualOutput,
  safeValidateVisualOutput,
  type LogicOutput,
  type StoryOutput,
  type PanelText,
  type VisualOutput,
  type VisualPanel
} from './schemas';

// --- Builder ---
export {
  PromptBuilder,
  buildPrompt,
  buildLogicPrompt,
  buildStoryPrompt,
  buildVisualPrompt
} from './builder';

// --- Pipeline ---
export {
  runPipeline,
  runPartialPipeline,
  logicStage,
  storyStage,
  visualStage,
  getLogicSchema,
  getStorySchema,
  getVisualSchema,
  DEFAULT_PIPELINE,
  type PipelineContext,
  type PipelineStage,
  type AICallFunction,
  type ProgressCallback
} from './pipeline';

// --- Versioned Prompts ---
export {
  LOGIC_PROMPTS,
  getLogicPrompt,
  getLogicPromptVersion,
  getAllLogicVersions,
  STORY_PROMPTS,
  getStoryPrompt,
  getStoryPromptVersion,
  getAllStoryVersions,
  VISUAL_PROMPTS,
  getVisualPrompt,
  getVisualPromptVersion,
  getAllVisualVersions
} from './versioned';

// --- i18n ---
export {
  PROMPT_LOCALES,
  getLocalizedPrompts,
  getLocalizedString,
  getUIStrings,
  SUPPORTED_LANGUAGES,
  type PromptLocale,
  type SupportedLanguage
} from './i18n';

// --- Cache ---
export {
  getCachedPrompt,
  invalidatePromptCache,
  getCacheStats,
  prewarmCache,
  CachedPromptBuilder
} from './cache';
