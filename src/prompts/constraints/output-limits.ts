import { AgeGroup, AgentStage } from '../types';

export interface OutputLimits {
  maxPanels: number;
  maxNarrativeLength: number;
  maxSentencesPerPanel: number;
  maxTitleLength: number;
  maxVisualPromptLength: number;
}

// Output constraints by age group
const OUTPUT_LIMITS_BY_AGE: Record<AgeGroup, Partial<OutputLimits>> = {
  toddler: {
    maxNarrativeLength: 50,
    maxSentencesPerPanel: 1,
    maxTitleLength: 30
  },
  elementary: {
    maxNarrativeLength: 80,
    maxSentencesPerPanel: 2,
    maxTitleLength: 40
  }
};

// Default limits
const DEFAULT_LIMITS: OutputLimits = {
  maxPanels: 12,
  maxNarrativeLength: 150,
  maxSentencesPerPanel: 2,
  maxTitleLength: 50,
  maxVisualPromptLength: 300
};

export const getOutputLimits = (ageGroup: AgeGroup): OutputLimits => {
  const ageSpecific = OUTPUT_LIMITS_BY_AGE[ageGroup] || {};
  return { ...DEFAULT_LIMITS, ...ageSpecific };
};

export const getOutputLimitsDirective = (ageGroup: AgeGroup): string => {
  const limits = getOutputLimits(ageGroup);
  return `# OUTPUT CONSTRAINTS
- Maximum panels: ${limits.maxPanels}
- Maximum narrative length per panel: ${limits.maxNarrativeLength} characters
- Maximum sentences per panel: ${limits.maxSentencesPerPanel}
- Maximum title length: ${limits.maxTitleLength} characters`;
};