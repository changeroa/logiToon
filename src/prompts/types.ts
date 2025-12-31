
// Prompt System Types

export type AgeGroup = 'toddler' | 'elementary';
export type StoryTone = 'humorous' | 'adventure' | 'gentle' | 'scientific';
export type CharacterType = 'auto' | 'robot' | 'animal' | 'human' | 'alien' | 'object';
export type StyleKey = '3d-clay' | 'watercolor' | 'ghibli-anime' | 'paper-cutout' | 'flat-vector';
export type AgentStage = 'logic' | 'story' | 'visual';
export type TopicCategory = 'physics' | 'biology' | 'emotions' | 'technology' | 'nature' | 'general';

export interface PromptConfig {
  ageGroup: AgeGroup;
  tone: StoryTone;
  character: CharacterType;
  style: StyleKey;
  language: string;
  topicCategory?: TopicCategory;
}

export interface AgeGroupConfig {
  label: string;
  prompt: string;
  negative: string;
  maxSentencesPerPanel: number;
  maxWordsPerSentence: number;
  toneGuide?: string;
  examplePanels?: { good: string; bad: string }[];
}

export interface ToneConfig {
  label: string;
  emoji: string;
  directive: string;
}

export interface CharacterConfig {
  label: string;
  emoji: string;
  guideline: string;
}

export interface StyleConfig {
  name: string;
  description: string;
  prompt: string;
  ui: {
    color: string;
  };
}

export interface VersionedPrompt {
  version: string;
  releaseDate: string;
  prompt: string;
  notes: string;
}
