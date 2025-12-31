// Re-export versioned prompts as the main agent prompts
export {
  getLogicPrompt,
  getLogicPromptVersion,
  getAllLogicVersions
} from '../versioned/logic';

export {
  getStoryPrompt,
  getStoryPromptVersion,
  getAllStoryVersions
} from '../versioned/story';

export {
  getVisualPrompt,
  getVisualPromptVersion,
  getAllVisualVersions
} from '../versioned/visual';

import { getLogicPrompt } from '../versioned/logic';
import { getStoryPrompt } from '../versioned/story';
import { getVisualPrompt } from '../versioned/visual';

// Convenience type for accessing all agent prompts
export const AGENT_PROMPTS = {
  logic: getLogicPrompt,
  story: getStoryPrompt,
  visual: getVisualPrompt
} as const;
