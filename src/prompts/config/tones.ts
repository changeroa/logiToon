import { StoryTone, ToneConfig } from '../types';

export const TONES: Record<StoryTone, ToneConfig> = {
  humorous: {
    label: "Funny & Wacky",
    emoji: "🤪",
    directive: "Use puns, silly sounds, and unexpected twists. Make them giggle! Include playful exaggeration and comic timing. Characters can be clumsy or have funny reactions."
  },
  adventure: {
    label: "Epic Adventure",
    emoji: "⚔️",
    directive: "Build tension, create challenges, celebrate victories! Use action words and exciting moments. The protagonist overcomes obstacles with courage."
  },
  gentle: {
    label: "Calm & Soothing",
    emoji: "🍃",
    directive: "Soft language, reassuring tone, cozy atmosphere. Use warm imagery and comforting metaphors. Perfect for bedtime or sensitive topics."
  },
  scientific: {
    label: "Tech & Science",
    emoji: "🔬",
    directive: "Accurate but accessible. Include 'Did you know?' moments. Celebrate discovery and curiosity. Make learning feel like detective work."
  }
};

export const getToneConfig = (tone: StoryTone): ToneConfig => {
  return TONES[tone];
};

export const getToneDirective = (tone: StoryTone): string => {
  const config = TONES[tone];
  return `# TONE: ${config.emoji} ${config.label}\n${config.directive}`;
};
