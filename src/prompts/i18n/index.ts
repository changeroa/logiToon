import { EN_PROMPTS } from './en';
import { KO_PROMPTS } from './ko';
import { JA_PROMPTS } from './ja';

// Type for prompt localization structure
export interface PromptLocale {
  logic: {
    role: string;
    task: string;
    metaphorQuestion: string;
    objectSelection: string;
  };
  story: {
    role: string;
    task: string;
    showDontTell: string;
    showExample: string;
  };
  visual: {
    role: string;
    task: string;
    characterDesign: string;
    criticalRule: string;
  };
  ui: {
    loading: string;
    generating: string;
    analyzing: string;
    writing: string;
    visualizing: string;
  };
}

// All available locales
export const PROMPT_LOCALES: Record<string, PromptLocale> = {
  en: EN_PROMPTS,
  ko: KO_PROMPTS,
  ja: JA_PROMPTS
};

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'ko', 'ja'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Get localized prompts for a language
export const getLocalizedPrompts = (language: string): PromptLocale => {
  return PROMPT_LOCALES[language] || PROMPT_LOCALES['en'];
};

// Get a specific localized string
export const getLocalizedString = (
  language: string,
  category: keyof PromptLocale,
  key: string
): string => {
  const locale = getLocalizedPrompts(language);
  const categoryObj = locale[category] as Record<string, string>;
  return categoryObj[key] || '';
};

// Get UI strings for a language
export const getUIStrings = (language: string) => {
  return getLocalizedPrompts(language).ui;
};

export { EN_PROMPTS, KO_PROMPTS, JA_PROMPTS };
