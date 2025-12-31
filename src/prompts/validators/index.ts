/**
 * 검증 시스템 진입점
 *
 * 모든 검증 관련 함수와 타입을 re-export합니다.
 */

export {
  // 타입
  ValidationResult,
  ValidationIssue,
  ContentValidation,

  // 스토리 검증
  validateStoryText,
  FORBIDDEN_PATTERNS,

  // 비주얼 검증
  validateVisualPrompt,
  FORBIDDEN_VISUAL_KEYWORDS,
  REQUIRED_VISUAL_KEYWORDS,

  // 통합 검증
  validateContent,

  // 자동 수정
  autoCorrectText,
  SAFE_ALTERNATIVES
} from './child-safety';
