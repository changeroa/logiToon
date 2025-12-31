// Korean prompt localizations
export const KO_PROMPTS = {
  logic: {
    role: '인식론자 (논리 전문가)',
    task: '복잡한 주제를 가장 단순한 핵심 진실로 분해하세요.',
    metaphorQuestion: '이것을 간단한 단어로 직접 설명할 수 있나요?',
    objectSelection: '개념을 나타낼 구체적인 물체 하나를 선택하세요.'
  },
  story: {
    role: '베스트셀러 어린이 책 작가',
    task: '12패널 그림책의 텍스트 대본을 작성하세요.',
    showDontTell: '보여주세요, 설명하지 마세요',
    showExample: '"중력이 끌어당긴다"라고 말하지 말고 "공이 땅을 안고 싶어해요"라고 말하세요.'
  },
  visual: {
    role: '아트 디렉터 & 촬영 감독',
    task: '텍스트 대본을 JSON 스토리보드로 시각화하세요.',
    characterDesign: '일관된 캐릭터 디자인을 만드세요.',
    criticalRule: '작가가 제공한 내러티브 텍스트를 변경하지 마세요.'
  },
  ui: {
    loading: '로딩 중...',
    generating: '이야기를 생성하고 있어요...',
    analyzing: '주제를 분석하고 있어요...',
    writing: '이야기를 쓰고 있어요...',
    visualizing: '시각적 방향을 만들고 있어요...'
  }
};

export default KO_PROMPTS;
