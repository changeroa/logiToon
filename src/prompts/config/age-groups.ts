
import { AgeGroup, AgeGroupConfig } from '../types';

export const AGE_GROUPS: Record<AgeGroup, AgeGroupConfig> = {
  toddler: {
    label: "Toddler (3-5 years)",
    prompt: `## WRITING GUIDE: Toddler Audience (Ages 3-5)

### MANDATORY RULES
- **Maximum 1 sentence** per panel.
- **Maximum 8 words** per sentence.
- **Onomatopoeia REQUIRED**: Must use sound words (e.g., "Whoosh!", "Bang!", "Sparkle!", "Pop!").
- Use simple Subject-Verb-Object structure.

### TONE & STYLE
**Good Examples:**
- "The little star wakes up. Twinkle twinkle!"
- "Bunny hops fast. Hop hop hop!"
- "Wow! It's a rainbow!"
- "The ball rolls down. Rolling rolling!"

**Bad Examples:**
- "The star emits light through nuclear fusion." (Too scientific)
- "Rabbits are mammals." (Textbook style)
- "Refraction creates a rainbow." (Abstract)

### SENTENCE PATTERNS (Use these!)
1. "[Subject] goes [Sound] [Action]!" -> "Robot goes beep-beep walk!"
2. "[Subject] is a [Adjective] [Noun]!" -> "The sky is a blue blanket!"
3. "Wow! [Observation]!" -> "Wow! A big flower!"
4. "[Subject] [Action]. [Result]!" -> "Water falls. Splash! Rain!"`,

    negative: `## ABSOLUTELY FORBIDDEN FOR TODDLERS

### FORBIDDEN LANGUAGE
- Abstract Nouns: Time, Future, Energy, Concept, Economy.
- Passive Voice: "It was done by..."
- Complex Sentences: "Because X happened, Y did Z."
- Scientific Terms: Spectrum, Density, Molecule, Gravity, Scattering.

### FORBIDDEN CONTENT
- Death, Dying, Blood, Pain.
- Scary warnings: "It's dangerous!", "Watch out!"
- Insults: "Stupid", "Dumb", "Ugly".
- Negative Commands: "Don't do that", "You must not".

### EMOTIONAL FRAMING
- Don't say: "Don't be sad." -> Do say: "It's okay to cry."
- Don't say: "Don't be scared." -> Do say: "Let's be brave together."`,

    maxSentencesPerPanel: 1,
    maxWordsPerSentence: 8,

    toneGuide: `
    Rhythmic: Read it aloud like a nursery rhyme!
    Warm: Speak like you are hugging the child.
    Exciting: Make them want to repeat the sounds!
    `,

    examplePanels: [
      { good: "Little robot opened its eyes. Blink blink!", bad: "The robot finished charging and activated its optical sensors." },
      { good: "Huh? The sky is blue! Why?", bad: "He wondered why the atmospheric color was blue." },
      { good: "Sunlight dances! Sparkle sparkle!", bad: "Solar radiation passes through the atmosphere." }
    ]
  },

  elementary: {
    label: "Elementary (6-8 years)",
    prompt: `## WRITING GUIDE: Elementary Audience (Ages 6-8)

### MANDATORY RULES
- **Maximum 2 sentences** per panel.
- **Maximum 12 words** per sentence.
- Use familiar **Similes**: "Just like a...", "As bright as..."
- Simple Cause & Effect: "So...", "That's why..."

### TONE & STYLE
**Good Examples:**
- "Tobot the robot looked out the window. The sky was shining blue."
- "Why is the sky blue? Tobot was curious."
- "Earth spins like a top. Round and round!"
- "Flowers want to invite butterflies. So they wear pretty colors!"

**Bad Examples:**
- "Due to Rayleigh scattering, blue light is scattered." (Jargon)
- "According to the law of conservation..." (Physics terms)
- "Plants use colors for pollination purposes." (Textbook style)

### SENTENCE PATTERNS (Use these!)
1. "[Character] did [Action]. They felt [Emotion]."
2. "Why [Phenomenon]? [Character] wondered."
3. "It is like [Analogy]. So [Result] happens."
4. "[Subject] wants [Goal]. So they [Action]!"`,

    negative: `## ABSOLUTELY FORBIDDEN FOR ELEMENTARY

### FORBIDDEN LANGUAGE
- Advanced Science: Quantum, Relativity, Thermodynamics, Photosynthesis.
- Abstract Concepts: Metaphysics, Socioeconomic, Philosophical.
- Textbook Definitions: "X is defined as..."
- Complex Connectors: Therefore, Consequently, Furthermore.

### FORBIDDEN CONTENT
- Direct mention of death (use metaphors like "sleeping" or "gone away").
- Violence or fighting.
- Competitions where someone loses badly.
- Inducing anxiety or fear.

### TONE FORBIDDEN
- Lecturing: "Listen carefully children..."
- Testing: "Remember this fact."
- Adult condescension.`,

    maxSentencesPerPanel: 2,
    maxWordsPerSentence: 12,

    toneGuide: `
    Curious: "Why does that happen?", "Isn't that strange?"
    Friendly: Explore together, don't just teach.
    Encouraging: "Great idea!", "You figured it out!"
    `,

    examplePanels: [
      { good: "Tobot looked at the window. The sky was glowing blue.", bad: "Tobot began observing the atmospheric conditions outside." },
      { good: "Why is it blue? Tobot wondered.", bad: "He questioned the chromatic properties of the sky." },
      { good: "Sunlight is like paint. It splashes blue color everywhere!", bad: "Short-wavelength blue light scatters more easily." }
    ]
  }
};

export const getAgeGroupConfig = (ageGroup: AgeGroup): AgeGroupConfig => {
  return AGE_GROUPS[ageGroup];
};

/**
 * Validates sentence length based on age group.
 */
export const validateSentenceLength = (
  text: string,
  ageGroup: AgeGroup
): { valid: boolean; issues: string[] } => {
  const config = AGE_GROUPS[ageGroup];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const issues: string[] = [];

  // Check sentence count
  if (sentences.length > config.maxSentencesPerPanel) {
    issues.push(`Sentence count exceeded: ${sentences.length} (Max ${config.maxSentencesPerPanel})`);
  }

  // Check word count per sentence
  sentences.forEach((sentence, index) => {
    const words = sentence.trim().split(/\s+/).filter(w => w);
    if (words.length > config.maxWordsPerSentence) {
      issues.push(`Sentence ${index + 1}: Word count exceeded (${words.length}, Max ${config.maxWordsPerSentence})`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * Check for forbidden words.
 */
export const FORBIDDEN_WORDS_BY_AGE: Record<AgeGroup, string[]> = {
  toddler: [
    // Science Jargon
    'spectrum', 'wavelength', 'particle', 'molecule', 'atom', 'photosynthesis', 'electromagnetic', 'hypothesis', 'correlation',
    'probability', 'quantum', 'frequency', 'velocity', 'acceleration', 'gravity', 'scattering', 'refraction', 'reflection',
    // Abstract
    'economy', 'democracy', 'philosophy', 'psychology', 'consciousness', 'evolution', 'metabolism', 'ecosystem', 'infrastructure',
    // Connectors
    'therefore', 'consequently', 'furthermore', 'nevertheless', 'essentially', 'fundamentally', 'theoretically',
    // Negative/Scary
    'die', 'death', 'danger', 'scary', 'terrible', 'horror', 'stupid', 'dumb', 'ugly', 'hate', 'kill'
  ],
  elementary: [
    // Advanced Science
    'quantum mechanics', 'relativity', 'thermodynamics', 'epistemology', 'phenomenology', 'ontology', 'electromagnetic radiation',
    'molecular structure', 'cellular respiration', 'genetic mutation', 'metaphysics', 'socioeconomic', 'geopolitical',
    // Negative/Scary
    'die', 'death', 'danger', 'scary', 'terrible', 'horror', 'stupid', 'dumb', 'ugly', 'hate', 'kill'
  ]
};

export const checkForbiddenWords = (
  text: string,
  ageGroup: AgeGroup
): { clean: boolean; foundWords: string[] } => {
  const forbidden = FORBIDDEN_WORDS_BY_AGE[ageGroup];
  const foundWords: string[] = [];

  for (const word of forbidden) {
    // Simple case-insensitive check
    if (text.toLowerCase().includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  }

  return {
    clean: foundWords.length === 0,
    foundWords
  };
};
