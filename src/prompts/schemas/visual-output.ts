
import { z } from 'zod';

// Visual panel schema
const VisualPanelSchema = z.object({
  panel_id: z.number()
    .min(1, 'Panel ID must be at least 1')
    .max(12, 'Panel ID must be at most 12'),

  shot_type: z.string()
    .min(3, 'Shot type must be specified'),

  composition: z.string()
    .min(3, 'Composition must be specified'),

  location: z.string()
    .min(3, 'Location description must be specified (e.g. "Bedroom", "Park")'),

  lighting_mood: z.string()
    .min(3, 'Lighting mood must be specified'),

  visual_prompt: z.string()
    .min(10, 'Visual prompt must be at least 10 characters')
    .max(1500, 'Visual prompt must be at most 1500 characters'),
  
  cinematic_reason: z.string().optional()
});

// Schema for Visual Agent output validation
export const VisualOutputSchema = z.object({
  target_age: z.string().optional(),

  style_preset: z.string()
    .min(2, 'Style preset must be specified'),

  character_anchor: z.string()
    .min(10, 'Character anchor must be at least 10 characters')
    .max(500, 'Character anchor must be at most 500 characters'),

  setting: z.string().optional().default(''),

  color_palette: z.string().optional().default(''),

  main_character_prompt: z.string()
    .min(10, 'Main character prompt must be at least 10 characters')
    .max(500, 'Main character prompt must be at most 500 characters'),

  panels: z.array(VisualPanelSchema)
    .min(1, 'Must have at least 1 panel')
    .max(12, 'Cannot have more than 12 panels')
});

export type VisualOutput = z.infer<typeof VisualOutputSchema>;
export type VisualPanel = z.infer<typeof VisualPanelSchema>;

// Validate visual output with detailed error reporting
export const validateVisualOutput = (raw: unknown): VisualOutput => {
  const result = VisualOutputSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.issues.map(e =>
      `${e.path.join('.')}: ${e.message}`
    ).join('; ');
    throw new Error(`Invalid Visual Agent output: ${errors}`);
  }

  return result.data;
};

// Safe validation that returns null instead of throwing
export const safeValidateVisualOutput = (raw: unknown): VisualOutput | null => {
  const result = VisualOutputSchema.safeParse(raw);
  return result.success ? result.data : null;
};
