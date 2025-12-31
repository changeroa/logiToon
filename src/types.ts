
export interface Panel {
  panel_id: number;
  
  // --- CINEMATOGRAPHY FIELDS ---
  shot_type: string;    // e.g., "Extreme Wide Shot", "Medium Shot", "Extreme Close-up"
  composition: string;  // e.g., "Low Angle", "Dutch Angle", "Rule of Thirds", "Symmetrical Center"
  // ----------------------------

  location?: string;     // Specific setting for this panel (e.g. "Kitchen", "Park")
  lighting_mood: string; 
  speaker: string; 
  narrative: string;
  visual_prompt: string;
  imageUrl?: string; 
}

export interface EducationalContent {
  summary: string;
}

export type StylePresetId = '3d-clay' | 'watercolor' | 'ghibli-anime' | 'paper-cutout' | 'flat-vector';

// Configuration Types
export type AgeGroup = 'toddler' | 'elementary';
export type StoryTone = 'humorous' | 'adventure' | 'gentle' | 'scientific';
export type CharacterType = 'auto' | 'robot' | 'animal' | 'human' | 'alien' | 'object';

export interface GenerationConfig {
  styleId: StylePresetId;
  ageGroup: AgeGroup;
  tone: StoryTone;
  characterType: CharacterType;
}

// --- NEW: 3-STAGE PIPELINE INTERFACES ---

// Stage 1: Logic
export interface ConceptPlan {
  detected_language: string;
  core_truth: string;        // The simplified fact
  analogy_model: string;     // The concrete object (e.g. "Invisible Blanket")
  is_metaphor_needed: boolean;
  forbidden_words: string[]; // Specific words to avoid
  safety_note?: string;      // Why this explanation is safe for children
}

// Stage 2: Narrative (Text Only)
export interface DraftScript {
  title: string;
  topic_summary: string;
  panels_text: {
    panel_id: number;
    speaker: string;
    narrative: string;
    rhythm_pattern?: string;  // Pattern 1-8 used (v4.0)
  }[];
  educational_summary: string; // The warm conclusion
  safety_check?: string;       // Why this story is safe for children
}

// Stage 3: Visuals (Merged into Final StoryResponse)
export interface StoryResponse {
  title: string;
  topic_summary: string;
  target_age: string;
  language?: string; 

  // --- VISUAL CONSISTENCY FIELDS ---
  style_preset: StylePresetId; 
  character_anchor: string;    
  setting: string;             // Default global setting
  color_palette: string;       
  // --------------------------------
  
  main_character_prompt: string;
  metaphor_explanation: string;
  panels: Panel[];
  educational_content: EducationalContent;

  // Character Reference System
  characters?: CharacterInfo[];  // 캐릭터 목록
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}

// Character Reference Types
export interface CharacterInfo {
  id: string;
  name: string;
  description: string;
  role: 'main' | 'supporting';
}

export interface CharacterRefs {
  [characterId: string]: string;  // base64 이미지
}

// Stage 3.5: Critic Review
export interface FlowAnalysis {
  transition: string;
  shot_change: string;
  position_change: string;
  verdict: 'PASS' | 'FIXED';
}

export interface CriticReviewSummary {
  panels_reviewed: number;
  issues_found: number;
  issues_fixed: number;
  flow_score: number;
}

export interface CriticReview {
  review_summary: CriticReviewSummary;
  flow_analysis: FlowAnalysis[];
  revised_panels: Panel[];
}
