
import { z } from 'zod';

// Schema for Logic Agent output validation
export const LogicOutputSchema = z.object({
  detected_language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code must be at most 5 characters'),

  core_truth: z.string()
    .min(10, 'Core truth must be at least 10 characters')
    .max(200, 'Core truth must be at most 200 characters'),

  analogy_model: z.string()
    .min(3, 'Analogy model must be at least 3 characters')
    .max(100, 'Analogy model must be at most 100 characters'),

  is_metaphor_needed: z.boolean().optional().default(true),

  forbidden_words: z.array(z.string())
    .min(1, 'Must include at least 1 forbidden word')
    .max(50, 'Cannot have more than 50 forbidden words'),
    
  safety_note: z.string().optional()
});

export type LogicOutput = z.infer<typeof LogicOutputSchema>;

// Validate logic output with detailed error reporting
export const validateLogicOutput = (raw: unknown): LogicOutput => {
  const result = LogicOutputSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.issues.map(e =>
      `${e.path.join('.')}: ${e.message}`
    ).join('; ');
    throw new Error(`Invalid Logic Agent output: ${errors}`);
  }

  return result.data;
};

// Safe validation that returns null instead of throwing
export const safeValidateLogicOutput = (raw: unknown): LogicOutput | null => {
  const result = LogicOutputSchema.safeParse(raw);
  return result.success ? result.data : null;
};
