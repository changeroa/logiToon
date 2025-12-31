import { describe, it, expect } from 'vitest';
import {
  LogicOutputSchema,
  validateLogicOutput,
  safeValidateLogicOutput
} from '../schemas/logic-output';
import {
  StoryOutputSchema,
  validateStoryOutput,
  safeValidateStoryOutput
} from '../schemas/story-output';
import {
  VisualOutputSchema,
  validateVisualOutput,
  safeValidateVisualOutput
} from '../schemas/visual-output';

describe('LogicOutputSchema', () => {
  const validLogicOutput = {
    detected_language: 'en',
    core_truth: 'Plants use sunlight to make food through photosynthesis.',
    analogy_model: 'A plant is like a kitchen that cooks with sunlight.',
    is_metaphor_needed: true,
    forbidden_words: ['chlorophyll', 'photosynthesis', 'molecule']
  };

  it('should validate correct logic output', () => {
    const result = LogicOutputSchema.safeParse(validLogicOutput);
    expect(result.success).toBe(true);
  });

  it('should reject empty core_truth', () => {
    const invalid = { ...validLogicOutput, core_truth: '' };
    const result = LogicOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject missing detected_language', () => {
    const { detected_language, ...rest } = validLogicOutput;
    const result = LogicOutputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should allow missing is_metaphor_needed (optional)', () => {
    const { is_metaphor_needed, ...rest } = validLogicOutput;
    const result = LogicOutputSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it('validateLogicOutput should throw on invalid input', () => {
    expect(() => validateLogicOutput({})).toThrow('Invalid Logic Agent output');
  });

  it('safeValidateLogicOutput should return null on invalid input', () => {
    expect(safeValidateLogicOutput({})).toBeNull();
  });
});

describe('StoryOutputSchema', () => {
  const validStoryOutput = {
    title: 'Why Plants Love the Sun',
    topic_summary: 'A story about how plants make food',
    panels_text: [
      { panel_id: 1, speaker: 'Narrator', narrative: 'Once upon a time...' },
      { panel_id: 2, speaker: 'Plant', narrative: 'I love the sun!' }
    ],
    educational_summary: 'Plants use sunlight to make their own food.'
  };

  it('should validate correct story output', () => {
    const result = StoryOutputSchema.safeParse(validStoryOutput);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalid = { ...validStoryOutput, title: '' };
    const result = StoryOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject panels_text exceeding 12 panels', () => {
    const panels = Array(15).fill(0).map((_, i) => ({
      panel_id: i + 1,
      speaker: 'Narrator',
      narrative: 'Text'
    }));
    const invalid = { ...validStoryOutput, panels_text: panels };
    const result = StoryOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should allow missing speaker (optional)', () => {
    const withoutSpeaker = {
      ...validStoryOutput,
      panels_text: [{ panel_id: 1, narrative: 'Text only' }]
    };
    const result = StoryOutputSchema.safeParse(withoutSpeaker);
    expect(result.success).toBe(true);
  });

  it('validateStoryOutput should throw on invalid input', () => {
    expect(() => validateStoryOutput({})).toThrow('Invalid Story Agent output');
  });

  it('safeValidateStoryOutput should return null on invalid input', () => {
    expect(safeValidateStoryOutput({})).toBeNull();
  });
});

describe('VisualOutputSchema', () => {
  const validVisualOutput = {
    style_preset: '3d-clay',
    character_anchor: 'A cute round robot with blue glowing eyes',
    main_character_prompt: 'A friendly robot with chrome body and blue LED eyes',
    setting: 'Sunny garden',
    color_palette: 'Warm yellows and greens',
    panels: [
      {
        panel_id: 1,
        shot_type: 'Wide Shot',
        composition: 'Rule of Thirds',
        lighting_mood: 'Golden hour',
        visual_prompt: 'Robot standing in garden, warm sunlight'
      }
    ]
  };

  it('should validate correct visual output', () => {
    const result = VisualOutputSchema.safeParse(validVisualOutput);
    expect(result.success).toBe(true);
  });

  it('should reject missing style_preset', () => {
    const { style_preset, ...rest } = validVisualOutput;
    const result = VisualOutputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should reject short character_anchor', () => {
    const invalid = { ...validVisualOutput, character_anchor: 'Short' };
    const result = VisualOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should allow missing optional fields', () => {
    const minimal = {
      style_preset: '3d-clay',
      character_anchor: 'A cute round robot with blue glowing eyes',
      main_character_prompt: 'A friendly robot with chrome body and blue LED eyes',
      panels: validVisualOutput.panels
    };
    const result = VisualOutputSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('validateVisualOutput should throw on invalid input', () => {
    expect(() => validateVisualOutput({})).toThrow('Invalid Visual Agent output');
  });

  it('safeValidateVisualOutput should return null on invalid input', () => {
    expect(safeValidateVisualOutput({})).toBeNull();
  });
});
