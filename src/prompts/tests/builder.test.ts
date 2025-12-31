import { describe, it, expect, beforeEach } from 'vitest';
import { PromptBuilder, buildPrompt } from '../builder';
import { PromptConfig } from '../types';

describe('PromptBuilder', () => {
  let defaultConfig: PromptConfig;

  beforeEach(() => {
    defaultConfig = {
      ageGroup: 'toddler',
      tone: 'humorous',
      character: 'robot',
      style: '3d-clay',
      language: 'en'
    };
  });

  describe('Logic Prompt', () => {
    it('should include age constraints', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('logic');

      expect(prompt).toContain('AUDIENCE CONSTRAINTS');
      expect(prompt).toContain('Toddler (3-5)');
    });

    it('should include forbidden words section', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('logic');

      expect(prompt).toContain('FORBIDDEN');
    });

    it('should include base logic prompt', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('logic');

      expect(prompt).toContain('Epistemologist');
      expect(prompt).toContain('core_truth');
      expect(prompt).toContain('analogy_model');
    });
  });

  describe('Story Prompt', () => {
    it('should include tone directive', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('story');

      expect(prompt).toContain('TONE');
      expect(prompt).toContain('Funny & Wacky');
    });

    it('should include character guideline', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('story');

      expect(prompt).toContain('CHARACTER ARCHETYPE');
      expect(prompt).toContain('Robot');
    });

    it('should include output limits', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('story');

      expect(prompt).toContain('OUTPUT CONSTRAINTS');
      expect(prompt).toContain('Maximum panels');
    });

    it('should include language directive', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('story');

      expect(prompt).toContain('OUTPUT LANGUAGE');
      expect(prompt).toContain('English');
    });

    it('should vary by age group', () => {
      const toddlerBuilder = new PromptBuilder({ ...defaultConfig, ageGroup: 'toddler' });
      const elementaryBuilder = new PromptBuilder({ ...defaultConfig, ageGroup: 'elementary' });

      const toddlerPrompt = toddlerBuilder.build('story');
      const elementaryPrompt = elementaryBuilder.build('story');

      expect(toddlerPrompt).toContain('EXTREME SIMPLICITY');
      expect(elementaryPrompt).toContain('Simple, friendly');
    });
  });

  describe('Visual Prompt', () => {
    it('should include style guide', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('visual');

      expect(prompt).toContain('STYLE GUIDE');
      expect(prompt).toContain('Disney Pixar');
    });

    it('should include character archetype', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('visual');

      expect(prompt).toContain('CHARACTER ARCHETYPE');
    });

    it('should include visual prompt keywords', () => {
      const builder = new PromptBuilder(defaultConfig);
      const prompt = builder.build('visual');

      expect(prompt).toContain('MANDATORY VISUAL STYLE');
    });
  });

  describe('Configuration', () => {
    it('should return config copy', () => {
      const builder = new PromptBuilder(defaultConfig);
      const config = builder.getConfig();

      expect(config).toEqual(defaultConfig);
      expect(config).not.toBe(defaultConfig); // Should be a copy
    });

    it('should create new builder with updated config', () => {
      const builder = new PromptBuilder(defaultConfig);
      const newBuilder = builder.withConfig({ ageGroup: 'elementary' });

      expect(builder.getConfig().ageGroup).toBe('toddler');
      expect(newBuilder.getConfig().ageGroup).toBe('elementary');
    });
  });

  describe('Factory Function', () => {
    it('should build prompt without instantiating class', () => {
      const prompt = buildPrompt('logic', defaultConfig);

      expect(prompt).toContain('Epistemologist');
      expect(prompt).toContain('AUDIENCE CONSTRAINTS');
    });
  });

  describe('Different Languages', () => {
    it('should include Korean language directive', () => {
      const builder = new PromptBuilder({ ...defaultConfig, language: 'ko' });
      const prompt = builder.build('story');

      expect(prompt).toContain('Korean');
      expect(prompt).toContain('ko');
    });

    it('should include Japanese language directive', () => {
      const builder = new PromptBuilder({ ...defaultConfig, language: 'ja' });
      const prompt = builder.build('story');

      expect(prompt).toContain('Japanese');
      expect(prompt).toContain('ja');
    });
  });
});