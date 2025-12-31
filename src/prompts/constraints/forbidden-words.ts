import { AgeGroup, TopicCategory } from '../types';

// Words that are too complex for each age group
export const FORBIDDEN_BY_AGE: Record<AgeGroup, string[]> = {
  toddler: [
    // Scientific terms
    'spectrum', 'wavelength', 'particle', 'molecule', 'atom',
    'photosynthesis', 'electromagnetic', 'hypothesis', 'correlation',
    'probability', 'quantum', 'frequency', 'velocity', 'acceleration',
    // Abstract concepts
    'economy', 'democracy', 'philosophy', 'psychology', 'consciousness',
    'evolution', 'metabolism', 'ecosystem', 'infrastructure',
    // Complex grammar markers
    'therefore', 'consequently', 'furthermore', 'nevertheless', 'however',
    'essentially', 'fundamentally', 'theoretically', 'approximately'
  ],
  elementary: [
    // Advanced scientific terms
    'quantum', 'relativistic', 'thermodynamic', 'epistemological',
    'phenomenological', 'ontological', 'electromagnetic radiation',
    'molecular structure', 'cellular respiration', 'genetic mutation',
    // Complex abstractions
    'metaphysical', 'philosophical', 'socioeconomic', 'geopolitical'
  ]
};

// Words to avoid based on topic to maintain positive framing
export const FORBIDDEN_BY_TOPIC: Record<TopicCategory, string[]> = {
  physics: [
    'easy', 'simple', 'obviously', 'trivial', 'just',
    // Avoid dismissive language about physics concepts
    'boring', 'complicated', 'confusing'
  ],
  biology: [
    'gross', 'disgusting', 'weird', 'icky', 'yucky',
    // Don't frame body/nature negatively
    'abnormal', 'wrong', 'broken'
  ],
  emotions: [
    'weak', 'bad', 'wrong', 'stupid', 'dumb',
    // Don't assign negative values to feelings
    'overreacting', 'too sensitive', 'dramatic'
  ],
  technology: [
    'magic', 'impossible', 'incomprehensible',
    // Technology should feel accessible
    'genius-level', 'rocket science'
  ],
  nature: [
    'dangerous', 'scary', 'threatening',
    // Nature should feel wondrous
    'boring', 'ordinary'
  ],
  general: [
    // Universal forbidden words
    'stupid', 'dumb', 'idiot', 'hate', 'ugly'
  ]
};

// Build combined forbidden words list based on context
export const buildForbiddenWords = (
  ageGroup: AgeGroup,
  topicCategory: TopicCategory = 'general'
): string[] => {
  const ageWords = FORBIDDEN_BY_AGE[ageGroup] || [];
  const topicWords = FORBIDDEN_BY_TOPIC[topicCategory] || [];
  const generalWords = FORBIDDEN_BY_TOPIC.general || [];

  // Combine and deduplicate
  return [...new Set([...ageWords, ...topicWords, ...generalWords])];
};

// Get forbidden words as formatted string for prompts
export const getForbiddenWordsDirective = (
  ageGroup: AgeGroup,
  topicCategory: TopicCategory = 'general'
): string => {
  const words = buildForbiddenWords(ageGroup, topicCategory);
  return `# FORBIDDEN VOCABULARY\nNever use these words: ${words.slice(0, 20).join(', ')}${words.length > 20 ? '...' : ''}`;
};