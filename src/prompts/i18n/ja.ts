// Japanese prompt localizations
export const JA_PROMPTS = {
  logic: {
    role: '認識論者（ロジック専門家）',
    task: '複雑なトピックを最もシンプルな核心的真実に分解してください。',
    metaphorQuestion: 'これは簡単な言葉で直接説明できますか？',
    objectSelection: 'コンセプトを表す具体的なオブジェクトを1つ選んでください。'
  },
  story: {
    role: 'ベストセラー児童書作家',
    task: '12パネルの絵本のテキスト台本を書いてください。',
    showDontTell: '見せて、説明しないで',
    showExample: '「重力が引っ張る」と言わずに「ボールが地面をハグしたがっている」と言いましょう。'
  },
  visual: {
    role: 'アートディレクター＆シネマトグラファー',
    task: 'テキスト台本をJSONストーリーボードに視覚化してください。',
    characterDesign: '一貫したキャラクターデザインを作成してください。',
    criticalRule: '作家が提供したナラティブテキストを変更しないでください。'
  },
  ui: {
    loading: '読み込み中...',
    generating: 'ストーリーを生成しています...',
    analyzing: 'トピックを分析しています...',
    writing: 'ナラティブを書いています...',
    visualizing: 'ビジュアルディレクションを作成しています...'
  }
};

export default JA_PROMPTS;
