// English prompt localizations
export const EN_PROMPTS = {
  logic: {
    role: 'The Epistemologist (Logic Expert)',
    task: 'Break down a complex topic into its simplest core truth.',
    metaphorQuestion: 'Can this be explained directly using simple words?',
    objectSelection: 'Choose ONE concrete object to represent the concept.'
  },
  story: {
    role: "Best-Selling Children's Book Author",
    task: 'Write the TEXT SCRIPT for a 12-panel picture book.',
    showDontTell: "Show, Don't Lecture",
    showExample: 'Don\'t say "Gravity pulls." Say "The ball wants to hug the ground."'
  },
  visual: {
    role: 'Art Director & Cinematographer',
    task: 'Visualize a text script into a JSON Storyboard.',
    characterDesign: 'Create a consistent character design.',
    criticalRule: 'Do NOT change the narrative text provided by the Author.'
  },
  ui: {
    loading: 'Loading...',
    generating: 'Generating your story...',
    analyzing: 'Analyzing the topic...',
    writing: 'Writing the narrative...',
    visualizing: 'Creating visual directions...'
  }
};

export default EN_PROMPTS;
