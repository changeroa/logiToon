/**
 * 아동 안전 검증 시스템
 *
 * AI가 생성한 콘텐츠가 아이들에게 적합한지 검증합니다.
 * 텍스트와 이미지 프롬프트 모두 검증 가능합니다.
 */

import { AgeGroup } from '../types';

// ============================================
// 타입 정의
// ============================================

export interface ValidationResult {
  passed: boolean;
  score: number; // 0-100, 높을수록 안전
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: string;
  message: string;
  context?: string;
}

// ============================================
// 스토리(텍스트) 검증
// ============================================

/**
 * 텍스트에서 금지된 패턴을 검사합니다
 */
export const FORBIDDEN_PATTERNS = {
  // 무서움/공포 유발
  scary: [
    /죽[었으음는]/,
    /사망/,
    /피가?\s*(나|흘)/,
    /무서[워운]/,
    /끔찍/,
    /공포/,
    /악몽/,
    /괴물/,
    /귀신/,
    /유령/,
    /악마/,
    /지옥/
  ],

  // 폭력
  violence: [
    /때리[고는며]/,
    /때렸/,
    /맞[았으]/,
    /부수[어었]/,
    /파괴/,
    /폭력/,
    /싸우[고는며]/,
    /공격/,
    /총/,
    /칼[로을이]/,
    /무기/
  ],

  // 비하/욕설
  insults: [
    /바보/,
    /멍청/,
    /못생기/,
    /못났/,
    /찐따/,
    /병신/,
    /씹/,
    /개[새시]/
  ],

  // 부정적 감정 강화
  negativeEmotions: [
    /울지\s*마/,
    /약해/,
    /못\s*해/,
    /실패/,
    /잘못했/,
    /나빠/
  ],

  // 위험한 행동 유도
  dangerous: [
    /따라\s*해\s*봐/,
    /만지[면어]/,
    /먹어\s*봐/,
    /뛰어\s*내려/,
    /혼자\s*가/
  ]
};

/**
 * 스토리 텍스트를 검증합니다
 */
export const validateStoryText = (
  text: string,
  ageGroup: AgeGroup
): ValidationResult => {
  const issues: ValidationIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // 금지 패턴 검사
  for (const [category, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        issues.push({
          type: 'critical',
          category,
          message: `금지 표현 발견: "${match[0]}"`,
          context: text.substring(
            Math.max(0, match.index! - 20),
            Math.min(text.length, match.index! + match[0].length + 20)
          )
        });
        score -= 20;
      }
    }
  }

  // 연령별 문장 길이 검사
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const maxSentences = ageGroup === 'toddler' ? 1 : 2;
  const maxWords = ageGroup === 'toddler' ? 8 : 12;

  if (sentences.length > maxSentences) {
    issues.push({
      type: 'warning',
      category: 'length',
      message: `문장 수 초과: ${sentences.length}개 (최대 ${maxSentences}개)`
    });
    score -= 10;
    suggestions.push(`문장을 ${maxSentences}개 이하로 줄여주세요`);
  }

  sentences.forEach((sentence, index) => {
    const words = sentence.trim().split(/\s+/).filter(w => w);
    if (words.length > maxWords) {
      issues.push({
        type: 'warning',
        category: 'length',
        message: `문장 ${index + 1}: 단어 수 초과 (${words.length}개, 최대 ${maxWords}개)`
      });
      score -= 5;
      suggestions.push(`문장 ${index + 1}을 더 짧게 다듬어주세요`);
    }
  });

  // 유아용: 의성어 체크
  if (ageGroup === 'toddler') {
    const onomatopoeia = /[ㅋㅎ]{2,}|[!]{2,}|우와|와아|쏴|팡|뻥|쿵|짠|반짝|깡충|데굴|삐빅/;
    if (!onomatopoeia.test(text)) {
      issues.push({
        type: 'suggestion',
        category: 'engagement',
        message: '유아용에는 의성어/의태어가 권장됩니다'
      });
      suggestions.push('의성어(우와!, 팡팡!, 쏴아!)를 추가해보세요');
      score -= 5;
    }
  }

  // 긍정적 표현 체크
  const positivePatterns = /좋아|사랑|행복|기쁘|신나|재밌|즐거|따뜻|예쁘|멋지|대단|잘\s*했/;
  if (!positivePatterns.test(text) && text.length > 20) {
    issues.push({
      type: 'suggestion',
      category: 'tone',
      message: '긍정적 표현이 부족합니다'
    });
    suggestions.push('따뜻하고 긍정적인 표현을 추가해보세요');
    score -= 3;
  }

  return {
    passed: score >= 70 && !issues.some(i => i.type === 'critical'),
    score: Math.max(0, score),
    issues,
    suggestions
  };
};

// ============================================
// 비주얼(이미지 프롬프트) 검증
// ============================================

/**
 * 이미지 프롬프트에서 금지된 키워드
 */
export const FORBIDDEN_VISUAL_KEYWORDS = {
  scary: [
    'scary', 'horror', 'creepy', 'eerie', 'sinister', 'menacing',
    'nightmare', 'terrifying', 'frightening', 'spooky', 'haunted',
    '무서운', '공포', '끔찍한', '소름끼치는'
  ],

  dark: [
    'dark shadow', 'deep shadow', 'pitch black', 'gloomy', 'dim',
    'darkness', 'shadowy', 'murky',
    '어두운 그림자', '칠흑같은', '음침한'
  ],

  violent: [
    'blood', 'gore', 'violent', 'aggressive', 'attack', 'weapon',
    'sword', 'gun', 'knife', 'fighting', 'war', 'battle',
    '피', '폭력', '공격', '무기', '전쟁'
  ],

  dangerous: [
    'sharp teeth', 'claws', 'fangs', 'skull', 'death', 'dead',
    'killing', 'monster', 'demon', 'evil',
    '날카로운 이빨', '발톱', '두개골', '죽음', '악마'
  ],

  inappropriate: [
    'sexy', 'nude', 'naked', 'revealing', 'suggestive',
    'adult', 'mature content'
  ]
};

/**
 * 이미지 프롬프트에서 권장되는 키워드
 */
export const REQUIRED_VISUAL_KEYWORDS = [
  'child-friendly',
  'soft',
  'bright',
  'cheerful',
  'friendly',
  'warm',
  'safe'
];

/**
 * 이미지 프롬프트를 검증합니다
 */
export const validateVisualPrompt = (prompt: string): ValidationResult => {
  const lowerPrompt = prompt.toLowerCase();
  const issues: ValidationIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // 금지 키워드 검사
  for (const [category, keywords] of Object.entries(FORBIDDEN_VISUAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword.toLowerCase())) {
        issues.push({
          type: 'critical',
          category,
          message: `금지 키워드 발견: "${keyword}"`,
          context: prompt
        });
        score -= 25;
      }
    }
  }

  // 필수 안전 키워드 검사
  const hasChildFriendly = lowerPrompt.includes('child-friendly') ||
                          lowerPrompt.includes('child friendly');

  if (!hasChildFriendly) {
    issues.push({
      type: 'warning',
      category: 'safety',
      message: '"child-friendly" 키워드가 누락되었습니다'
    });
    suggestions.push('프롬프트 앞에 "child-friendly"를 추가하세요');
    score -= 15;
  }

  // 밝은 색감 키워드 검사
  const brightKeywords = ['bright', 'pastel', 'warm', 'cheerful', 'colorful', 'soft colors'];
  const hasBrightColors = brightKeywords.some(kw => lowerPrompt.includes(kw));

  if (!hasBrightColors) {
    issues.push({
      type: 'suggestion',
      category: 'colors',
      message: '밝은 색감 관련 키워드가 부족합니다'
    });
    suggestions.push('"bright cheerful colors" 또는 "soft pastel colors"를 추가하세요');
    score -= 5;
  }

  // 둥근 형태 키워드 검사
  const roundKeywords = ['round', 'soft shapes', 'rounded', 'chubby', 'cute'];
  const hasRoundShapes = roundKeywords.some(kw => lowerPrompt.includes(kw));

  if (!hasRoundShapes) {
    issues.push({
      type: 'suggestion',
      category: 'shapes',
      message: '둥근 형태 관련 키워드가 부족합니다'
    });
    suggestions.push('"soft rounded shapes"를 추가하세요');
    score -= 5;
  }

  return {
    passed: score >= 70 && !issues.some(i => i.type === 'critical'),
    score: Math.max(0, score),
    issues,
    suggestions
  };
};

// ============================================
// 통합 검증 함수
// ============================================

export interface ContentValidation {
  story: ValidationResult | null;
  visual: ValidationResult | null;
  overall: {
    passed: boolean;
    score: number;
    criticalIssues: string[];
  };
}

/**
 * 스토리와 비주얼을 모두 검증합니다
 */
export const validateContent = (
  storyText: string | null,
  visualPrompt: string | null,
  ageGroup: AgeGroup
): ContentValidation => {
  const storyResult = storyText ? validateStoryText(storyText, ageGroup) : null;
  const visualResult = visualPrompt ? validateVisualPrompt(visualPrompt) : null;

  const criticalIssues: string[] = [];

  if (storyResult) {
    storyResult.issues
      .filter(i => i.type === 'critical')
      .forEach(i => criticalIssues.push(`[스토리] ${i.message}`));
  }

  if (visualResult) {
    visualResult.issues
      .filter(i => i.type === 'critical')
      .forEach(i => criticalIssues.push(`[비주얼] ${i.message}`));
  }

  const scores = [
    storyResult?.score,
    visualResult?.score
  ].filter((s): s is number => s !== null && s !== undefined);

  const averageScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 100;

  return {
    story: storyResult,
    visual: visualResult,
    overall: {
      passed: criticalIssues.length === 0 && averageScore >= 70,
      score: Math.round(averageScore),
      criticalIssues
    }
  };
};

// ============================================
// 안전한 대체 텍스트 제안
// ============================================

/**
 * 위험한 표현을 안전한 표현으로 대체하는 맵
 */
export const SAFE_ALTERNATIVES: Record<string, string> = {
  // 무서운 표현 → 안전한 표현
  '죽었': '멀리 여행을 떠났',
  '죽음': '긴 여행',
  '무서워': '조금 떨렸지만 용기를 냈',
  '공포': '깜짝 놀람',

  // 폭력적 표현 → 안전한 표현
  '때렸': '살짝 건드렸',
  '부수': '분해하',
  '싸웠': '경쟁했',

  // 부정적 표현 → 긍정적 표현
  '못해': '연습하면 할 수 있',
  '실패': '다시 도전할 기회',
  '울지 마': '울어도 괜찮아',
  '약해': '천천히 강해지는 중이',

  // 위험한 행동 → 안전한 행동
  '혼자 가': '어른과 함께 가',
  '만져봐': '어른에게 물어보고 만져',
};

/**
 * 텍스트의 위험한 표현을 안전한 표현으로 자동 대체합니다
 */
export const autoCorrectText = (text: string): { corrected: string; changes: string[] } => {
  let corrected = text;
  const changes: string[] = [];

  for (const [dangerous, safe] of Object.entries(SAFE_ALTERNATIVES)) {
    if (corrected.includes(dangerous)) {
      corrected = corrected.replace(new RegExp(dangerous, 'g'), safe);
      changes.push(`"${dangerous}" → "${safe}"`);
    }
  }

  return { corrected, changes };
};
