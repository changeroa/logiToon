
import {
  PromptConfig,
  AgentStage,
} from './types';

import { getAgeGroupConfig } from './config/age-groups';
import { getToneDirective } from './config/tones';
import { getCharacterGuideline } from './config/characters';
import { getStyleConfig } from './styles';
import { getForbiddenWordsDirective } from './constraints/forbidden-words';
import { getOutputLimitsDirective } from './constraints/output-limits';
import { getLogicPrompt } from './versioned/logic';
import { getStoryPrompt } from './versioned/story';
import { getVisualPrompt } from './versioned/visual';

/**
 * PromptBuilder - Builder pattern for constructing dynamic prompts
 */
export class PromptBuilder {
  private config: PromptConfig;

  constructor(config: PromptConfig) {
    this.config = config;
  }

  // --- Private builder methods ---

  private buildAudienceConstraints(): string {
    const age = getAgeGroupConfig(this.config.ageGroup);
    return `
# AUDIENCE CONSTRAINTS
- Target: ${age.label}
- Writing Style: ${age.prompt}
- RESTRICTIONS: ${age.negative}
`;
  }

  private buildToneDirective(): string {
    return getToneDirective(this.config.tone);
  }

  private buildCharacterGuide(): string {
    return getCharacterGuideline(this.config.character);
  }

  private buildStyleGuide(): string {
    const style = getStyleConfig(this.config.style);
    return `
# STYLE GUIDE: ${style.name}
- Description: ${style.description}
- **MANDATORY VISUAL STYLE**: ${style.prompt}
`;
  }

  private buildAgeVisualGuide(): string {
    if (this.config.ageGroup === 'toddler') {
      return `
# 🎨 Toddler Visual Guide (Ages 3-5)
## Character Placement
- **Size**: Takes up **50-60%** of frame
- **Position**: **Center** or slightly left
- **Face**: **1/3** of character height
- **Expression**: Simple and clear emotions

## Background
- **Colors**: Max 2 colors, simple gradient
- **Props**: 1-2 only

## Forbidden
❌ Sharp corners, dark shadows, complex backgrounds
`;
    } else {
      return `
# 🎨 Elementary Visual Guide (Ages 6-8)
## Character Placement
- **Size**: Takes up **35-45%** of frame
- **Position**: **Rule of Thirds**
- **Expression**: Rich emotional expression

## Background
- **Colors**: 3-4 colors
- **Detail**: Contextual elements allowed

## Allowed
✅ Environmental context, diagonal composition
`;
    }
  }

  private buildForbiddenWords(): string {
    return getForbiddenWordsDirective(
      this.config.ageGroup,
      this.config.topicCategory || 'general'
    );
  }

  private buildOutputLimits(): string {
    return getOutputLimitsDirective(this.config.ageGroup);
  }

  private buildLanguageDirective(): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'ko': '한국어 (Korean)',
      'ja': '日本語 (Japanese)',
      'zh': '中文 (Chinese)',
      'es': 'Español (Spanish)',
      'fr': 'Français (French)',
      'de': 'Deutsch (German)'
    };
    const langName = languageNames[this.config.language] || this.config.language;
    return `
# OUTPUT LANGUAGE
- Write ALL content in: ${langName}
- Do NOT default to English unless "${this.config.language}" is "en"
`;
  }

  private getBasePrompt(stage: AgentStage): string {
    switch (stage) {
      case 'logic': return getLogicPrompt();
      case 'story': return getStoryPrompt();
      case 'visual': return getVisualPrompt();
      default: throw new Error(`Unknown stage: ${stage}`);
    }
  }

  // --- Public API ---

  build(stage: AgentStage): string {
    const base = this.getBasePrompt(stage);

    switch (stage) {
      case 'logic': return this.buildLogicPrompt(base);
      case 'story': return this.buildStoryPrompt(base);
      case 'visual': return this.buildVisualPrompt(base);
      default: throw new Error(`Unknown stage: ${stage}`);
    }
  }

  private buildLogicPrompt(base: string): string {
    return `${base}\n\n${this.buildAudienceConstraints()}\n${this.buildForbiddenWords()}`.trim();
  }

  private buildStoryPrompt(base: string): string {
    return `${base}\n\n${this.buildAudienceConstraints()}\n${this.buildToneDirective()}\n${this.buildCharacterGuide()}\n${this.buildOutputLimits()}\n${this.buildLanguageDirective()}`.trim();
  }

  private buildVisualPrompt(base: string): string {
    return `${base}\n\n${this.buildAgeVisualGuide()}\n${this.buildStyleGuide()}\n${this.buildCharacterGuide()}`.trim();
  }

  getConfig(): PromptConfig {
    return { ...this.config };
  }

  withConfig(updates: Partial<PromptConfig>): PromptBuilder {
    return new PromptBuilder({ ...this.config, ...updates });
  }
}

export const buildPrompt = (stage: AgentStage, config: PromptConfig): string => {
  return new PromptBuilder(config).build(stage);
};

export const buildLogicPrompt = (config: PromptConfig): string => buildPrompt('logic', config);
export const buildStoryPrompt = (config: PromptConfig): string => buildPrompt('story', config);
export const buildVisualPrompt = (config: PromptConfig): string => buildPrompt('visual', config);
