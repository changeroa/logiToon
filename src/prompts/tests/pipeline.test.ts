import { describe, it, expect, vi } from 'vitest';
import {
  runPipeline,
  logicStage,
  storyStage,
  visualStage,
  PipelineContext,
  AICallFunction
} from '../pipeline';
import { PromptConfig } from '../types';

describe('Pipeline', () => {
  const defaultConfig: PromptConfig = {
    ageGroup: 'elementary',
    tone: 'humorous',
    character: 'robot',
    style: '3d-clay',
    language: 'en'
  };

  const mockLogicResult = {
    detected_language: 'en',
    core_truth: 'Grass is green because of chlorophyll.',
    analogy_model: 'Grass wears green clothes made of tiny green helpers.',
    is_metaphor_needed: true,
    forbidden_words: ['chlorophyll', 'pigment', 'molecule']
  };

  const mockStoryResult = {
    title: 'Why is Grass Green?',
    topic_summary: 'A story about the color of grass',
    panels_text: [
      { panel_id: 1, speaker: 'Narrator', narrative: 'Once upon a time...' },
      { panel_id: 2, speaker: 'Robot', narrative: 'Hello!' }
    ],
    educational_summary: 'Grass has tiny helpers called chlorophyll that make it green.'
  };

  const mockVisualResult = {
    style_preset: '3d-clay',
    character_anchor: 'A friendly chrome robot with blue LED eyes',
    main_character_prompt: 'Cute round robot with glowing blue eyes',
    setting: 'Grassy meadow',
    color_palette: 'Bright greens and warm yellows',
    panels: [
      {
        panel_id: 1,
        shot_type: 'Wide Shot',
        composition: 'Rule of Thirds',
        lighting_mood: 'Golden hour',
        visual_prompt: 'Robot looking at grass'
      }
    ]
  };

  describe('logicStage', () => {
    it('should call AI and return validated logic result', async () => {
      const mockAI: AICallFunction = vi.fn().mockResolvedValue(mockLogicResult);
      const ctx: PipelineContext = {
        topic: 'Why is grass green?',
        config: defaultConfig,
        errors: []
      };

      const result = await logicStage(ctx, mockAI);

      expect(mockAI).toHaveBeenCalled();
      expect(result.logicResult).toBeDefined();
      expect(result.logicResult?.core_truth).toBe(mockLogicResult.core_truth);
      expect(result.errors).toHaveLength(0);
    });

    it('should add error on AI failure', async () => {
      const mockAI: AICallFunction = vi.fn().mockRejectedValue(new Error('API Error'));
      const ctx: PipelineContext = {
        topic: 'Why is grass green?',
        config: defaultConfig,
        errors: []
      };

      const result = await logicStage(ctx, mockAI);

      expect(result.logicResult).toBeUndefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Logic stage failed');
    });
  });

  describe('storyStage', () => {
    it('should require logic result', async () => {
      const mockAI: AICallFunction = vi.fn();
      const ctx: PipelineContext = {
        topic: 'Why is grass green?',
        config: defaultConfig,
        errors: []
      };

      const result = await storyStage(ctx, mockAI);

      expect(mockAI).not.toHaveBeenCalled();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('requires logic result');
    });

    it('should call AI with logic context', async () => {
      const mockAI: AICallFunction = vi.fn().mockResolvedValue(mockStoryResult);
      const ctx: PipelineContext = {
        topic: 'Why is grass green?',
        config: defaultConfig,
        logicResult: mockLogicResult,
        errors: []
      };

      const result = await storyStage(ctx, mockAI);

      expect(mockAI).toHaveBeenCalled();
      const userPrompt = (mockAI as any).mock.calls[0][1];
      expect(userPrompt).toContain(mockLogicResult.core_truth);
      expect(result.storyResult).toBeDefined();
    });
  });

  describe('visualStage', () => {
    it('should require story result', async () => {
      const mockAI: AICallFunction = vi.fn();
      const ctx: PipelineContext = {
        topic: 'Why is grass green?',
        config: defaultConfig,
        logicResult: mockLogicResult,
        errors: []
      };

      const result = await visualStage(ctx, mockAI);

      expect(mockAI).not.toHaveBeenCalled();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('requires story result');
    });

    it('should call AI with story context', async () => {
      const mockAI: AICallFunction = vi.fn().mockResolvedValue(mockVisualResult);
      const ctx: PipelineContext = {
        topic: 'Why is grass green?',
        config: defaultConfig,
        logicResult: mockLogicResult,
        storyResult: mockStoryResult,
        errors: []
      };

      const result = await visualStage(ctx, mockAI);

      expect(mockAI).toHaveBeenCalled();
      expect(result.visualResult).toBeDefined();
    });
  });

  describe('runPipeline', () => {
    it('should run all stages in sequence', async () => {
      const mockAI: AICallFunction = vi.fn()
        .mockResolvedValueOnce(mockLogicResult)
        .mockResolvedValueOnce(mockStoryResult)
        .mockResolvedValueOnce(mockVisualResult);

      const result = await runPipeline(
        'Why is grass green?',
        defaultConfig,
        mockAI
      );

      expect(mockAI).toHaveBeenCalledTimes(3);
      expect(result.logicResult).toBeDefined();
      expect(result.storyResult).toBeDefined();
      expect(result.visualResult).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('should stop on first error', async () => {
      const mockAI: AICallFunction = vi.fn()
        .mockResolvedValueOnce(mockLogicResult)
        .mockRejectedValueOnce(new Error('Story failed'));

      const result = await runPipeline(
        'Why is grass green?',
        defaultConfig,
        mockAI
      );

      expect(mockAI).toHaveBeenCalledTimes(2);
      expect(result.logicResult).toBeDefined();
      expect(result.storyResult).toBeUndefined();
      expect(result.visualResult).toBeUndefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should call progress callback', async () => {
      const mockAI: AICallFunction = vi.fn()
        .mockResolvedValueOnce(mockLogicResult)
        .mockResolvedValueOnce(mockStoryResult)
        .mockResolvedValueOnce(mockVisualResult);

      const onProgress = vi.fn();

      await runPipeline(
        'Why is grass green?',
        defaultConfig,
        mockAI,
        onProgress
      );

      expect(onProgress).toHaveBeenCalledTimes(3);
      expect(onProgress).toHaveBeenCalledWith('Logic', 'Analyzing topic...');
      expect(onProgress).toHaveBeenCalledWith('Story', 'Writing narrative...');
      expect(onProgress).toHaveBeenCalledWith('Visual', 'Directing visuals...');
    });
  });
});
