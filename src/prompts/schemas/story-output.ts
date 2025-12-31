import { z } from 'zod';

// Panel text schema
const PanelTextSchema = z.object({
  panel_id: z.number()
    .min(1, 'Panel ID must be at least 1')
    .max(12, 'Panel ID must be at most 12'),

  speaker: z.string().optional().default(''),

  narrative: z.string()
    .min(1, 'Narrative cannot be empty')
    .max(500, 'Narrative must be at most 500 characters')
});

// Schema for Story Agent output validation
export const StoryOutputSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  topic_summary: z.string()
    .min(10, 'Topic summary must be at least 10 characters')
    .max(300, 'Topic summary must be at most 300 characters'),

  panels_text: z.array(PanelTextSchema)
    .min(1, 'Must have at least 1 panel')
    .max(12, 'Cannot have more than 12 panels'),

  educational_summary: z.string()
    .min(10, 'Educational summary must be at least 10 characters')
    .max(500, 'Educational summary must be at most 500 characters')
});

export type StoryOutput = z.infer<typeof StoryOutputSchema>;
export type PanelText = z.infer<typeof PanelTextSchema>;

// Validate story output with detailed error reporting
export const validateStoryOutput = (raw: unknown): StoryOutput => {
  const result = StoryOutputSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.issues.map(e =>
      `${e.path.join('.')}: ${e.message}`
    ).join('; ');
    throw new Error(`Invalid Story Agent output: ${errors}`);
  }

  return result.data;
};

// Safe validation that returns null instead of throwing
export const safeValidateStoryOutput = (raw: unknown): StoryOutput | null => {
  const result = StoryOutputSchema.safeParse(raw);
  return result.success ? result.data : null;
};