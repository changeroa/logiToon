
import { z } from 'zod';

const CriticPanelSchema = z.object({
  panel_id: z.number(),
  speaker: z.string().optional().default(''),
  narrative: z.string().optional().default(''),
  shot_type: z.string(),
  composition: z.string(),
  lighting_mood: z.string(),
  visual_prompt: z.string()
});

export const CriticOutputSchema = z.object({
  review_summary: z.object({
    panels_reviewed: z.number(),
    issues_found: z.number(),
    issues_fixed: z.number(),
    flow_score: z.number()
  }),
  flow_analysis: z.array(z.object({
    transition: z.string(),
    shot_change: z.string(),
    position_change: z.string(),
    verdict: z.string()
  })),
  revised_panels: z.array(CriticPanelSchema)
});

export type CriticOutput = z.infer<typeof CriticOutputSchema>;
export type CriticPanel = z.infer<typeof CriticPanelSchema>;

export const validateCriticOutput = (raw: unknown): CriticOutput => {
  const result = CriticOutputSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Invalid Critic Agent output: ${errors}`);
  }
  return result.data;
};
