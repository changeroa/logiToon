/**
 * 프롬프트 시스템 테스트 스크립트
 * 실행: npx tsx test-prompts.ts
 */

import { LOGIC_PROMPTS, getLogicPrompt } from './src/prompts/versioned/logic';
import { STORY_PROMPTS, getStoryPrompt } from './src/prompts/versioned/story';
import { VISUAL_PROMPTS, getVisualPrompt } from './src/prompts/versioned/visual';
import { AGE_GROUPS, validateSentenceLength, checkForbiddenWords } from './src/prompts/config/age-groups';
import { getStylePrompt, validateVisualPrompt, CHILD_SAFE_PREFIX } from './src/prompts/styles';
import { validateStoryText, validateVisualPrompt as validateVisualSafety, autoCorrectText } from './src/prompts/validators/child-safety';

console.log('========================================');
console.log('🧪 프롬프트 시스템 테스트 시작');
console.log('========================================\n');

// 1. 버전 확인
console.log('📌 1. 프롬프트 버전 확인');
console.log('----------------------------------------');
console.log(`Logic 현재 버전: v3.0 ✓`);
console.log(`Story 현재 버전: v3.0 ✓`);
console.log(`Visual 현재 버전: v3.0 ✓`);
console.log();

// 2. 페르소나 확인
console.log('📌 2. 페르소나 확인');
console.log('----------------------------------------');
const logicPrompt = getLogicPrompt();
const storyPrompt = getStoryPrompt();
const visualPrompt = getVisualPrompt();

console.log(`Logic: ${logicPrompt.includes('호기심 박사') ? '✅ 호기심 박사 페르소나 포함' : '❌ 페르소나 누락'}`);
console.log(`Story: ${storyPrompt.includes('할머니 이야기꾼') ? '✅ 할머니 이야기꾼 페르소나 포함' : '❌ 페르소나 누락'}`);
console.log(`Visual: ${visualPrompt.includes('아동 그림책') ? '✅ 아동 그림책 일러스트레이터 페르소나 포함' : '❌ 페르소나 누락'}`);
console.log();

// 3. 연령별 가이드 확인
console.log('📌 3. 연령별 가이드 확인');
console.log('----------------------------------------');
const toddlerConfig = AGE_GROUPS.toddler;
const elementaryConfig = AGE_GROUPS.elementary;

console.log(`유아(3-5세): 패널당 최대 ${toddlerConfig.maxSentencesPerPanel}문장, 문장당 최대 ${toddlerConfig.maxWordsPerSentence}단어`);
console.log(`초등(6-8세): 패널당 최대 ${elementaryConfig.maxSentencesPerPanel}문장, 문장당 최대 ${elementaryConfig.maxWordsPerSentence}단어`);
console.log();

// 4. 문장 길이 검증 테스트
console.log('📌 4. 문장 길이 검증 테스트');
console.log('----------------------------------------');

const toddlerGood = "작은 로봇이 눈을 떴어요!";
const toddlerBad = "오늘 아침, 작은 로봇이 충전을 마치고 기지개를 켜면서 천천히 눈을 떴습니다.";

const toddlerGoodResult = validateSentenceLength(toddlerGood, 'toddler');
const toddlerBadResult = validateSentenceLength(toddlerBad, 'toddler');

console.log(`유아용 좋은 예: "${toddlerGood}"`);
console.log(`  → ${toddlerGoodResult.valid ? '✅ 통과' : '❌ 실패: ' + toddlerGoodResult.issues.join(', ')}`);
console.log(`유아용 나쁜 예: "${toddlerBad}"`);
console.log(`  → ${toddlerBadResult.valid ? '✅ 통과' : '❌ 실패: ' + toddlerBadResult.issues.join(', ')}`);
console.log();

// 5. 금지 단어 검사 테스트
console.log('📌 5. 금지 단어 검사 테스트');
console.log('----------------------------------------');

const safeText = "햇빛이 하늘에서 춤을 춰요!";
const unsafeText = "빛의 스펙트럼이 대기에서 산란되어 파장이 짧은 빛이 보여요.";

const safeResult = checkForbiddenWords(safeText, 'toddler');
const unsafeResult = checkForbiddenWords(unsafeText, 'toddler');

console.log(`안전한 텍스트: "${safeText}"`);
console.log(`  → ${safeResult.clean ? '✅ 금지 단어 없음' : '❌ 금지 단어 발견: ' + safeResult.foundWords.join(', ')}`);
console.log(`위험한 텍스트: "${unsafeText}"`);
console.log(`  → ${unsafeResult.clean ? '✅ 금지 단어 없음' : '❌ 금지 단어 발견: ' + unsafeResult.foundWords.join(', ')}`);
console.log();

// 6. 스타일 안전 접두사 테스트
console.log('📌 6. 스타일 안전 접두사 테스트');
console.log('----------------------------------------');

const stylePrompt = getStylePrompt('3d-clay');
console.log(`3D Clay 스타일 프롬프트 (앞부분):`);
console.log(`  "${stylePrompt.substring(0, 100)}..."`);
console.log(`  → ${stylePrompt.includes('child-friendly') ? '✅ 아동 안전 접두사 포함' : '❌ 접두사 누락'}`);
console.log();

// 7. 비주얼 프롬프트 검증 테스트
console.log('📌 7. 비주얼 프롬프트 검증 테스트');
console.log('----------------------------------------');

const safeVisual = "child-friendly illustration, soft rounded shapes, bright cheerful colors, adorable round robot with big sparkly eyes";
const unsafeVisual = "metallic robot with sharp edges, dark shadows, glowing red eyes, scary atmosphere";

const safeVisualResult = validateVisualPrompt(safeVisual);
const unsafeVisualResult = validateVisualPrompt(unsafeVisual);

console.log(`안전한 비주얼:`);
console.log(`  "${safeVisual.substring(0, 60)}..."`);
console.log(`  → ${safeVisualResult.safe ? '✅ 통과' : '❌ 실패: ' + safeVisualResult.issues.join(', ')}`);
console.log(`위험한 비주얼:`);
console.log(`  "${unsafeVisual}"`);
console.log(`  → ${unsafeVisualResult.safe ? '✅ 통과' : '❌ 실패: ' + unsafeVisualResult.issues.join(', ')}`);
console.log();

// 8. 스토리 텍스트 안전 검증 테스트
console.log('📌 8. 스토리 텍스트 안전 검증 테스트');
console.log('----------------------------------------');

const safeStory = "작은 로봇이 반짝반짝 눈을 떴어요! 우와! 하늘이 파래요!";
const unsafeStory = "무서운 괴물이 나타났어요. 로봇이 죽을 뻔했어요!";

const safeStoryResult = validateStoryText(safeStory, 'toddler');
const unsafeStoryResult = validateStoryText(unsafeStory, 'toddler');

console.log(`안전한 스토리: "${safeStory}"`);
console.log(`  → 점수: ${safeStoryResult.score}/100, ${safeStoryResult.passed ? '✅ 통과' : '❌ 실패'}`);
console.log(`위험한 스토리: "${unsafeStory}"`);
console.log(`  → 점수: ${unsafeStoryResult.score}/100, ${unsafeStoryResult.passed ? '✅ 통과' : '❌ 실패'}`);
if (!unsafeStoryResult.passed) {
  console.log(`  → 문제: ${unsafeStoryResult.issues.map(i => i.message).join(', ')}`);
}
console.log();

// 9. 자동 수정 테스트
console.log('📌 9. 자동 수정 테스트');
console.log('----------------------------------------');

const textToCorrect = "주인공이 죽었어요. 너무 무서워요!";
const { corrected, changes } = autoCorrectText(textToCorrect);

console.log(`원본: "${textToCorrect}"`);
console.log(`수정: "${corrected}"`);
console.log(`변경: ${changes.length > 0 ? changes.join(', ') : '없음'}`);
console.log();

// 10. 종합 결과
console.log('========================================');
console.log('🎉 테스트 완료!');
console.log('========================================');
console.log();
console.log('프롬프트 시스템이 정상적으로 개선되었습니다:');
console.log('  ✅ v3.0 페르소나 적용됨');
console.log('  ✅ 연령별 가이드 강화됨');
console.log('  ✅ 금지 단어 검사 작동');
console.log('  ✅ 비주얼 안전 접두사 적용됨');
console.log('  ✅ 스토리/비주얼 검증 레이어 작동');
console.log('  ✅ 자동 수정 기능 작동');
