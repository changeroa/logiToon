
import { StyleKey, StyleConfig } from '../types';
import { STYLE_3D_CLAY } from './3d-clay';
import { STYLE_WATERCOLOR } from './watercolor';
import { STYLE_GHIBLI_ANIME } from './ghibli-anime';
import { STYLE_PAPER_CUTOUT } from './paper-cutout';
import { STYLE_FLAT_VECTOR } from './flat-vector';

/**
 * 기본 아동 안전 접두사 (업그레이드 버전)
 * World-class quality 보장을 위한 키워드 추가
 */
export const CHILD_SAFE_PREFIX = [
  "masterpiece children's book illustration",
  "best quality",
  "highly detailed",
  "child-friendly illustration",
  "soft rounded shapes",
  "bright cheerful colors",
  "warm inviting atmosphere",
  "suitable for children ages 3-8",
  "no scary elements",
  "friendly and safe"
].join(', ');

/**
 * 동화책 전용 상세 프리픽스 (Picture Book Professional Prefix)
 *
 * AI 이미지 생성기가 전문 동화책 품질의 이미지를 생성하도록 유도합니다.
 * 캐릭터 가이드, 배경 가이드, 색상 가이드, 구도 가이드를 포함합니다.
 */
export const PICTURE_BOOK_PREFIX = {
  // 공통 기본 설정
  base: [
    "children's picture book illustration",
    "professional storybook quality",
    "safe for ages 3-8",
    "no scary or threatening elements"
  ].join(', '),

  // 캐릭터 가이드 - REMOVED FIXED POSITIONING
  character: [
    "expressive protagonist",
    "oversized head with big sparkly eyes",
    "soft rounded body proportions",
    "friendly welcoming expression",
    "clear emotional readability"
  ].join(', '),

  // 배경 가이드
  background: [
    "simplified background",
    "soft depth of field effect",
    "gentle bokeh or blur for depth",
    "clear foreground-midground-background separation"
  ].join(', '),

  // 색상 가이드
  colors: [
    "warm pastel color palette",
    "no pure white or pure black backgrounds",
    "harmonious complementary colors",
    "soft shadows only",
    "warm golden or soft natural lighting"
  ].join(', '),

  // 구도 가이드 - UPDATED FOR DYNAMISM
  composition: [
    "dynamic storybook composition", // Changed from static constraints
    "clear visual hierarchy",
    "generous whitespace for text",
    "eye naturally flows left to right",
    "breathing room around subjects"
  ].join(', '),

  // 스타일 마감
  style: [
    "storybook charm and warmth",
    "inviting cozy atmosphere",
    "gentle and nurturing mood",
    "magical but safe feeling"
  ].join(', ')
};

/**
 * 연령별 동화책 프리픽스
 */
export const AGE_SPECIFIC_PREFIX = {
  // 유아용 (3-5세): 명확성 중시
  toddler: [
    "for toddlers ages 3-5",
    "clear and simple subject focus",
    "maximum 2 colors in background",
    "extremely simple shapes",
    "oversized facial features",
    "bold primary pastel colors",
    "minimal background details",
    "high contrast for easy recognition"
  ].join(', '),

  // 초등용 (6-8세): 맥락 중시
  elementary: [
    "for children ages 6-8",
    "environmental context visible",
    "3-4 colors allowed in scene",
    "subtle storytelling elements",
    "more nuanced expressions",
    "softer color gradients"
  ].join(', ')
};

/**
 * 완전한 동화책 프리픽스를 생성합니다
 */
export const buildPictureBookPrefix = (ageGroup: 'toddler' | 'elementary' = 'toddler'): string => {
  return [
    PICTURE_BOOK_PREFIX.base,
    AGE_SPECIFIC_PREFIX[ageGroup],
    PICTURE_BOOK_PREFIX.character,
    PICTURE_BOOK_PREFIX.colors,
    PICTURE_BOOK_PREFIX.composition,
    PICTURE_BOOK_PREFIX.style
  ].join(', ');
};

/**
 * 패널 위치별 특화 프리픽스 - REMOVED FIXED POSITIONS
 */
export const PANEL_POSITION_PREFIX = {
  // 시작 패널 (1): 훅
  hook: "establishing shot, inviting atmosphere, clear introduction of subject",

  // 궁금증 패널 (2-3): 질문
  curiosity: "visual cues of wondering, upward looking gaze, generous negative space",

  // 비유 패널 (4-5): 발견
  analogy: "magical discovery moment, light rays or sparkles, clear visual comparison",

  // 탐구 패널 (6-10): 놀이 - DYNAMIC
  exploration: "dynamic action shot, varying angles, playful interaction, movement lines",

  // 마무리 패널 (11-12): 따뜻함
  ending: "warm concluding moment, satisfied happy expression, golden hour lighting, cozy wrap-up feeling"
};

/**
 * 금지 키워드 (이미지 프롬프트에서 절대 사용 금지)
 */
export const FORBIDDEN_VISUAL_KEYWORDS = [
  'scary', 'dark', 'shadow', 'creepy', 'horror', 'blood', 'sharp', 'weapon',
  'dangerous', 'threatening', 'sinister', 'eerie', 'gloomy', 'menacing',
  'violent', 'aggressive', 'evil', 'demon', 'monster', 'nightmare',
  'teeth', 'claws', 'fangs', 'skull', 'death', 'dead', 'killing'
];

// Style library with all available styles
export const STYLE_LIBRARY: Record<StyleKey, StyleConfig> = {
  '3d-clay': STYLE_3D_CLAY,
  'watercolor': STYLE_WATERCOLOR,
  'ghibli-anime': STYLE_GHIBLI_ANIME,
  'paper-cutout': STYLE_PAPER_CUTOUT,
  'flat-vector': STYLE_FLAT_VECTOR
};

// Get a specific style configuration
export const getStyleConfig = (styleKey: StyleKey): StyleConfig => {
  return STYLE_LIBRARY[styleKey];
};

/**
 * 스타일 프롬프트를 아동 안전 접두사와 함께 반환합니다.
 * 모든 이미지 생성에서 이 함수를 사용하세요.
 */
export const getStylePrompt = (styleKey: StyleKey): string => {
  const basePrompt = STYLE_LIBRARY[styleKey].prompt;
  return `${CHILD_SAFE_PREFIX}, ${basePrompt}`;
};

/**
 * 동화책 전용 스타일 프롬프트를 반환합니다.
 * 더 상세한 동화책 구도 가이드가 포함됩니다.
 */
export const getPictureBookStylePrompt = (
  styleKey: StyleKey,
  ageGroup: 'toddler' | 'elementary' = 'toddler',
  panelPosition?: 'hook' | 'curiosity' | 'analogy' | 'exploration' | 'ending'
): string => {
  const baseStylePrompt = STYLE_LIBRARY[styleKey].prompt;
  const pictureBookPrefix = buildPictureBookPrefix(ageGroup);
  const panelPrefix = panelPosition ? PANEL_POSITION_PREFIX[panelPosition] : '';

  const parts = [pictureBookPrefix, baseStylePrompt];
  if (panelPrefix) {
    parts.push(panelPrefix);
  }

  return parts.join(', ');
};

/**
 * 원본 스타일 프롬프트를 반환합니다 (접두사 없음, 특수한 경우에만 사용).
 */
export const getRawStylePrompt = (styleKey: StyleKey): string => {
  return STYLE_LIBRARY[styleKey].prompt;
};

/**
 * 비주얼 프롬프트가 안전한지 검증합니다.
 * @returns 안전하지 않은 경우 발견된 금지 키워드 목록을 반환
 */
export const validateVisualPrompt = (prompt: string): { safe: boolean; issues: string[] } => {
  const lowerPrompt = prompt.toLowerCase();
  const issues: string[] = [];

  for (const keyword of FORBIDDEN_VISUAL_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      issues.push(`금지 키워드 발견: "${keyword}"`);
    }
  }

  return {
    safe: issues.length === 0,
    issues
  };
};

/**
 * 완전한 비주얼 프롬프트를 빌드합니다.
 * 안전 접두사 + 스타일 + 장면 설명을 결합합니다.
 */
export const buildSafeVisualPrompt = (
  styleKey: StyleKey,
  sceneDescription: string
): { prompt: string; validation: { safe: boolean; issues: string[] } } => {
  const stylePrompt = getStylePrompt(styleKey);
  const fullPrompt = `${stylePrompt}, ${sceneDescription}`;

  const validation = validateVisualPrompt(sceneDescription);

  return {
    prompt: fullPrompt,
    validation
  };
};

// Get all available style keys
export const getAvailableStyles = (): StyleKey[] => {
  return Object.keys(STYLE_LIBRARY) as StyleKey[];
};

// Re-export individual styles for direct import if needed
export {
  STYLE_3D_CLAY,
  STYLE_WATERCOLOR,
  STYLE_GHIBLI_ANIME,
  STYLE_PAPER_CUTOUT,
  STYLE_FLAT_VECTOR
};

// Re-export components
export * from './components';
