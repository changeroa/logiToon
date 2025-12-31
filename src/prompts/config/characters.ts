
import { CharacterType, CharacterConfig } from '../types';

export const CHARACTERS: Record<CharacterType, CharacterConfig> = {
  auto: {
    label: "Auto-Cast",
    emoji: "🎬",
    guideline: "You have total creative freedom to cast the perfect main character for this specific story. It could be a child, an animal, a robot, or a personified object (like a brave toaster). Choose whatever protagonist best fits the analogy and tone. Ensure they are lovable and have clear visual traits. **DO NOT DEFAULT TO A ROBOT** unless it specifically fits the story concept best. Try to use Animals, Magical Creatures, or Human Children."
  },
  robot: {
    label: "Robot",
    emoji: "🤖",
    guideline: "Mechanical but adorable. Makes beeping and whirring sounds. Glowing eyes show emotion (happy=blue, curious=green, surprised=yellow). Has extendable arms and can transform slightly."
  },
  animal: {
    label: "Animal",
    emoji: "🦊",
    guideline: "Anthropomorphic and expressive. Ears and tail show emotion. Species-specific quirks (fox=clever, owl=wise, bunny=curious). Wears simple clothes or accessories."
  },
  alien: {
    label: "Alien",
    emoji: "👽",
    guideline: "Otherworldly but friendly. Has a unique communication style (speaks in third person or uses made-up words). Fascinated by Earth things. Antenna glows with emotion."
  },
  human: {
    label: "Kid Hero",
    emoji: "🧒",
    guideline: "Relatable kid hero facing age-appropriate challenges. Has a signature accessory (cap, backpack, glasses). Shows genuine emotions kids can identify with."
  },
  object: {
    label: "Magic Object",
    emoji: "🔮",
    guideline: "Animated household item with personality derived from function (lamp=illuminating ideas, clock=time wisdom). Has expressive 'eyes' and can move/bounce. Surprisingly wise."
  }
};

export const getCharacterConfig = (character: CharacterType): CharacterConfig => {
  return CHARACTERS[character];
};

export const getCharacterGuideline = (character: CharacterType): string => {
  const config = CHARACTERS[character];
  return `# CHARACTER ARCHETYPE: ${config.emoji} ${config.label}\n${config.guideline}`;
};
