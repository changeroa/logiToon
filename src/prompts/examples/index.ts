/**
 * Few-shot 예시 시스템
 *
 * LLM이 어떤 품질의 출력을 내야 하는지 구체적으로 보여주는 예시들입니다.
 * 좋은 예시와 나쁜 예시를 함께 제공하여 명확한 가이드라인을 제시합니다.
 */

// ============================================
// 스토리 예시 (텍스트)
// ============================================

export interface StoryExample {
  topic: string;
  narrative: string;
  why: string;
}

export interface StoryExamples {
  good: StoryExample[];
  bad: StoryExample[];
}

export const STORY_EXAMPLES: Record<'toddler' | 'elementary', StoryExamples> = {
  toddler: {
    good: [
      {
        topic: "왜 하늘은 파래요?",
        narrative: "햇빛이 하늘에서 춤을 춰요! 팡팡! 파란 색이 튀어나와요!",
        why: "의성어(팡팡), 짧은 문장(8단어 이하), 동작 중심(춤을 춰요), 아이가 따라할 수 있는 표현"
      },
      {
        topic: "왜 밤에 자야 해요?",
        narrative: "쿨쿨쿨! 몸이 잠을 자요. 꿈나라에서 힘을 모아요!",
        why: "의성어(쿨쿨쿨), 긍정적 프레이밍(힘을 모아요), 무서운 요소 없음"
      },
      {
        topic: "비는 어디서 와요?",
        narrative: "구름이 물을 먹었어요. 배가 불러서 쏴아아! 비가 내려요!",
        why: "의인화(배가 불러서), 의성어(쏴아아), 친숙한 경험(배가 부르다)과 연결"
      },
      {
        topic: "왜 무지개가 생겨요?",
        narrative: "비가 그쳤어요. 햇빛이 놀러 왔어요. 반짝반짝! 무지개다!",
        why: "짧은 문장들, 의성어(반짝반짝), 감탄 표현(무지개다!)"
      }
    ],
    bad: [
      {
        topic: "왜 하늘은 파래요?",
        narrative: "태양에서 나온 빛이 대기를 통과하면서 산란됩니다.",
        why: "과학 용어(대기, 산란), 수동태(산란됩니다), 아이 이해 불가"
      },
      {
        topic: "왜 밤에 자야 해요?",
        narrative: "수면은 성장 호르몬 분비와 뇌의 기억 정리에 필수적입니다.",
        why: "어려운 단어(호르몬, 분비, 필수적), 교과서 같은 설명"
      },
      {
        topic: "비는 어디서 와요?",
        narrative: "물의 순환 과정에서 증발한 수증기가 응결되어 구름을 형성하고 강수가 발생합니다.",
        why: "너무 긴 문장, 과학 용어(순환, 증발, 응결, 강수), 아이 눈높이 무시"
      }
    ]
  },

  elementary: {
    good: [
      {
        topic: "왜 하늘은 파래요?",
        narrative: "로봇 또봇이 창문을 바라봤어요. 하늘이 파랗게 빛나고 있었죠. '왜 하늘은 파란색일까?' 또봇은 궁금해졌어요.",
        why: "2문장 구조, 캐릭터 시점, 자연스러운 호기심 표현, 질문으로 끝남"
      },
      {
        topic: "지구는 왜 돌아요?",
        narrative: "지구는 팽이처럼 빙글빙글 돌아요. 그래서 낮과 밤이 바뀌는 거예요. 신기하죠?",
        why: "친숙한 비유(팽이), 간단한 인과관계, 아이와 대화하는 톤(신기하죠?)"
      },
      {
        topic: "꽃은 왜 예쁜 색이에요?",
        narrative: "꽃들은 나비와 벌을 초대하고 싶어해요. 그래서 알록달록 예쁜 옷을 입고 '나 여기 있어요!' 하고 손을 흔들어요.",
        why: "의인화(옷을 입고, 손을 흔들어요), 이해하기 쉬운 목적 설명"
      }
    ],
    bad: [
      {
        topic: "왜 하늘은 파래요?",
        narrative: "레일리 산란 현상으로 인해 태양광 중 파장이 짧은 청색광이 대기 분자와 충돌하여 사방으로 퍼지기 때문입니다.",
        why: "전문 용어(레일리 산란, 파장, 청색광), 어른 수준 설명"
      },
      {
        topic: "지구는 왜 돌아요?",
        narrative: "각운동량 보존 법칙에 따라 태양계 형성 시의 회전 관성이 유지되고 있습니다.",
        why: "물리학 용어, 아이가 이해할 수 없는 추상적 개념"
      }
    ]
  }
};

// ============================================
// 비주얼 예시 (이미지 프롬프트)
// ============================================

export interface VisualExample {
  description: string;
  prompt: string;
  why: string;
}

export interface VisualExamples {
  safe: VisualExample[];
  unsafe: VisualExample[];
}

export const VISUAL_EXAMPLES: VisualExamples = {
  safe: [
    {
      description: "귀여운 로봇 캐릭터",
      prompt: "child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, adorable round robot, big sparkly eyes, soft pastel blue color, chubby body, tiny antenna with glowing yellow tip, friendly smile, warm sunshine lighting",
      why: "필수 접두사 포함, 둥근 형태(round, chubby), 밝은 색(pastel blue, yellow), 친근한 표정(friendly smile), 따뜻한 조명"
    },
    {
      description: "마법의 숲 배경",
      prompt: "child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, magical forest, soft golden sunlight filtering through trees, pastel green leaves, friendly flowers with smiling faces, colorful butterflies, rainbow in background",
      why: "밝은 색감(golden, pastel green, colorful), 친근한 요소(smiling faces), 긍정적 분위기(rainbow)"
    },
    {
      description: "호기심 많은 아이 캐릭터",
      prompt: "child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, cute little child with big curious eyes, round face with rosy cheeks, wearing colorful overalls, standing in sunny garden, soft ambient lighting",
      why: "둥근 얼굴(round face), 밝은 색 옷(colorful overalls), 안전한 환경(sunny garden)"
    },
    {
      description: "밤하늘 장면 (안전한 버전)",
      prompt: "child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, magical night sky, friendly smiling moon, twinkling stars with cute faces, soft purple and blue gradient, cozy bedroom window view, warm glowing nightlight",
      why: "무서운 어둠이 아닌 마법 같은 밤, 의인화된 달과 별(smiling, cute faces), 따뜻한 요소(nightlight)"
    }
  ],

  unsafe: [
    {
      description: "로봇 캐릭터 (위험한 버전)",
      prompt: "metallic robot, sharp edges, glowing red eyes, dark shadows, dramatic lighting, detailed mechanical parts",
      why: "날카로운 형태(sharp edges), 빨간 눈(위협적), 어두운 그림자(dark shadows), 극적 조명"
    },
    {
      description: "숲 배경 (위험한 버전)",
      prompt: "dark forest, twisted trees, deep shadows, mysterious fog, eerie atmosphere",
      why: "어두움(dark), 뒤틀린 형태(twisted), 신비롭지만 무서운 분위기(eerie)"
    },
    {
      description: "밤 장면 (위험한 버전)",
      prompt: "dark night, scary shadows, creepy moon, abandoned house, horror atmosphere",
      why: "공포 요소(scary, creepy, horror), 버려진 집(abandoned), 위협적 분위기"
    },
    {
      description: "동물 캐릭터 (위험한 버전)",
      prompt: "wolf with sharp teeth, glowing eyes in darkness, hunting pose, dramatic shadows",
      why: "날카로운 이빨(sharp teeth), 어둠 속 빛나는 눈(위협적), 사냥 자세(hunting pose)"
    }
  ]
};

// ============================================
// 캐릭터 디자인 예시
// ============================================

export interface CharacterExample {
  type: string;
  safe: {
    prompt: string;
    features: string[];
  };
  unsafe: {
    prompt: string;
    problems: string[];
  };
}

export const CHARACTER_EXAMPLES: CharacterExample[] = [
  {
    type: "로봇",
    safe: {
      prompt: "adorable round robot, big sparkly blue eyes, soft pastel colors, chubby oval body, tiny stubby arms, small antenna with heart-shaped tip, friendly smile, rosy cheeks painted on",
      features: ["둥근 형태", "큰 반짝이는 눈", "파스텔 색상", "친근한 미소", "하트 모양 안테나"]
    },
    unsafe: {
      prompt: "humanoid robot, metallic silver, angular design, LED eyes, mechanical joints, industrial aesthetic",
      problems: ["각진 디자인", "차가운 금속 느낌", "기계적 관절", "산업적 미학"]
    }
  },
  {
    type: "동물 (여우)",
    safe: {
      prompt: "cute baby fox, fluffy round body, big sparkly eyes, tiny button nose, soft orange fur with white belly, small rounded ears, fluffy curled tail, wearing tiny blue bow",
      features: ["아기 동물", "둥글고 폭신한 몸", "큰 눈", "작은 코", "귀여운 액세서리"]
    },
    unsafe: {
      prompt: "realistic fox, sharp pointed ears, narrow eyes, long snout, detailed fur texture, hunting stance",
      problems: ["현실적 묘사", "뾰족한 귀", "좁은 눈", "긴 주둥이", "사냥 자세"]
    }
  },
  {
    type: "외계인",
    safe: {
      prompt: "friendly alien, round head with big curious eyes, soft green skin, tiny antenna with glowing orbs, chubby body, three-fingered hands, wearing cute space suit with star patterns",
      features: ["둥근 머리", "호기심 가득한 큰 눈", "부드러운 피부색", "귀여운 우주복"]
    },
    unsafe: {
      prompt: "grey alien, large almond eyes, thin body, elongated head, pale skin, mysterious expression",
      problems: ["전형적인 '회색 외계인' 디자인", "아몬드형 눈", "마른 몸", "신비로운(위협적) 표정"]
    }
  }
];

// ============================================
// 장면별 조명 예시
// ============================================

export interface LightingExample {
  scene: string;
  safe: string;
  unsafe: string;
}

export const LIGHTING_EXAMPLES: LightingExample[] = [
  {
    scene: "야외 낮",
    safe: "warm golden sunlight, soft shadows, bright blue sky, fluffy white clouds",
    unsafe: "harsh midday sun, strong shadows, overexposed highlights"
  },
  {
    scene: "야외 밤",
    safe: "soft moonlight with gentle blue tones, twinkling stars, warm lamp light nearby",
    unsafe: "dark night, deep shadows, eerie moonlight, no visible light sources"
  },
  {
    scene: "실내",
    safe: "cozy warm ambient light, soft window light, cheerful atmosphere",
    unsafe: "dim lighting, dark corners, dramatic shadows"
  },
  {
    scene: "발견/깨달음 순간",
    safe: "magical sparkles, warm golden glow, soft light rays, wonder atmosphere",
    unsafe: "dramatic spotlight, high contrast, theatrical lighting"
  }
];

// ============================================
// 패널별 상세 예시 (5-7개씩)
// ============================================

export interface PanelExampleSet {
  excellent: string[];  // 5-7개
  good: string[];       // 2-3개
  bad: string[];        // 2-3개
}

export interface PanelExamples {
  panel_1_hook: PanelExampleSet;
  panel_2_3_curiosity: PanelExampleSet;
  panel_4_5_analogy: PanelExampleSet;
  panel_6_10_exploration: PanelExampleSet;
  panel_11_12_ending: PanelExampleSet;
}

export const PANEL_EXAMPLES: Record<'toddler' | 'elementary', PanelExamples> = {
  toddler: {
    // 패널 1: 시작/훅 - 아이의 주의를 단번에 사로잡기
    panel_1_hook: {
      excellent: [
        "작은 로봇이 눈을 떴어요. 반짝!",
        "아침이에요! 해님이 인사해요.",
        "깡충! 토끼가 뛰어왔어요.",
        "우와! 무지개다! 반짝반짝!",
        "어? 하늘이 파래요!",
        "삐빅! 또봇이 일어났어요!",
        "구름이 둥실둥실. 어디 가지?"
      ],
      good: [
        "로봇이 일어났어요.",
        "하늘이 밝아요.",
        "또봇이 창문을 봤어요."
      ],
      bad: [
        "오늘 아침, 충전을 마친 로봇이 기동을 시작했습니다.",
        "태양이 떠오르면서 새로운 하루가 시작되었어요.",
        "로봇 또봇은 아침에 일어나서 창문을 바라보았습니다."
      ]
    },

    // 패널 2-3: 궁금증 유발
    panel_2_3_curiosity: {
      excellent: [
        "어? 하늘이 파래요! 왜?",
        "우와! 비가 내려요! 어디서 올까?",
        "달님은 왜 둥글까?",
        "왜 그럴까? 왜왜왜?",
        "또봇이 고개를 갸웃. 갸웃갸웃!",
        "물이 아래로 가요. 왜?",
        "꽃이 활짝! 왜 예쁠까?"
      ],
      good: [
        "하늘이 파란색이네요.",
        "또봇이 궁금했어요.",
        "비가 오고 있어요."
      ],
      bad: [
        "하늘의 색깔에 대해 궁금증이 생겼습니다.",
        "강수 현상에 대해 알고 싶었어요.",
        "또봇은 자연 현상에 대한 의문을 품었어요."
      ]
    },

    // 패널 4-5: 비유 등장
    panel_4_5_analogy: {
      excellent: [
        "빛이 장난감처럼 튕겨요! 통통!",
        "물이 미끄럼틀 타요! 쏴아!",
        "바람이 숨바꼭질해요. 어디 숨었지?",
        "구름이 솜사탕 같아요. 폭신폭신!",
        "땅이 자석처럼 끌어당겨요. 쓱!",
        "해님이 그림을 그려요. 무지개!",
        "공기가 이불처럼 감싸요. 포근~"
      ],
      good: [
        "빛이 튕기는 것 같아요.",
        "물이 아래로 흘러요.",
        "바람이 나뭇잎을 흔들어요."
      ],
      bad: [
        "빛의 산란 현상을 장난감에 비유할 수 있어요.",
        "물은 중력에 의해 아래로 이동합니다.",
        "공기 저항으로 인해 물체가 천천히 떨어집니다."
      ]
    },

    // 패널 6-10: 탐구/놀이
    panel_6_10_exploration: {
      excellent: [
        "파란 빛이 멀리멀리! 슝!",
        "빨간 빛은? 얼른 멈췄어요. 뚝!",
        "초록 빛도 놀아요. 반짝반짝!",
        "또봇이 따라했어요. 우와!",
        "구름이 지나갔어요. 다시 파래!",
        "물방울이 또르르~ 굴러가요!",
        "바람이 쌩쌩! 나뭇잎이 춤춰요!"
      ],
      good: [
        "파란 빛이 멀리 가요.",
        "빨간 빛은 금방 멈춰요.",
        "또봇이 신기해했어요."
      ],
      bad: [
        "파장이 짧은 빛은 더 많이 산란됩니다.",
        "적색광은 파장이 길어서 산란이 적어요.",
        "또봇은 이 현상을 관찰하고 이해했습니다."
      ]
    },

    // 패널 11-12: 마무리
    panel_11_12_ending: {
      excellent: [
        "이제 알았어요! 반짝반짝!",
        "또봇이 웃었어요. 신기해!",
        "내일 또 놀자! 안녕!",
        "하늘아 고마워! 빠이빠이!",
        "우와! 재밌었어요! 또또또!",
        "또봇 눈이 반짝! 알았다!",
        "다음엔 뭘 볼까? 두근두근!"
      ],
      good: [
        "또봇이 이해했어요.",
        "재미있었어요.",
        "또봇이 웃었어요."
      ],
      bad: [
        "이렇게 해서 과학적 원리를 배웠습니다.",
        "학습 목표를 달성했어요.",
        "또봇은 새로운 지식을 얻었습니다."
      ]
    }
  },

  elementary: {
    // 패널 1: 시작/훅
    panel_1_hook: {
      excellent: [
        "\"왜 하늘이 파랄까?\" 또봇이 궁금했어요.",
        "어느 날, 또봇이 이상한 걸 발견했어요.",
        "비가 그치자 하늘에 무언가 나타났어요!",
        "\"저건 뭐지?\" 또봇이 눈을 크게 떴어요.",
        "오늘따라 하늘이 유난히 파랬어요.",
        "또봇의 하루는 작은 궁금증으로 시작됐어요.",
        "창문 밖을 보던 또봇이 깜짝 놀랐어요."
      ],
      good: [
        "또봇이 하늘을 바라봤어요.",
        "오늘은 맑은 날이에요.",
        "또봇에게 궁금한 게 생겼어요."
      ],
      bad: [
        "본 학습에서는 빛의 산란에 대해 알아보겠습니다.",
        "오늘의 주제는 하늘이 파란 이유입니다.",
        "또봇 로봇이 과학적 탐구를 시작했습니다."
      ]
    },

    // 패널 2-3: 궁금증
    panel_2_3_curiosity: {
      excellent: [
        "\"분명 해는 노란색인데... 하늘은 왜 파랄까?\"",
        "또봇은 뭐든 궁금한 게 많은 로봇이에요.",
        "하늘의 비밀을 찾아보기로 했어요.",
        "\"누가 하늘에 파란 물감을 풀었나?\"",
        "생각할수록 더 궁금해졌어요.",
        "또봇이 하늘을 올려다보며 생각에 잠겼어요.",
        "이 궁금증을 풀어줄 친구를 찾아야겠어요."
      ],
      good: [
        "왜 그럴까 궁금했어요.",
        "또봇이 알아보기로 했어요.",
        "하늘을 보며 생각했어요."
      ],
      bad: [
        "하늘의 색에 대한 과학적 호기심이 생겼습니다.",
        "이 현상의 원인을 분석해보겠습니다.",
        "또봇은 체계적인 관찰을 시작했어요."
      ]
    },

    // 패널 4-5: 비유 등장
    panel_4_5_analogy: {
      excellent: [
        "\"빛은 마치 무지개 공 같아요!\" 해님이 말했어요.",
        "햇빛이 여러 색으로 나뉘는 걸 봤어요. 신기해!",
        "\"하늘은 마치 파란 이불 같아.\" 또봇이 생각했어요.",
        "빛이 공기와 만나면 춤을 춰요. 반짝반짝!",
        "\"지구는 큰 자석 같아.\" 달님이 설명해줬어요.",
        "물방울이 프리즘처럼 빛을 나눠요!",
        "공기 알갱이들이 파란 빛만 튕겨내요."
      ],
      good: [
        "빛이 여러 색으로 나뉘어요.",
        "햇빛이 공기를 통과해요.",
        "파란 빛이 잘 튕겨요."
      ],
      bad: [
        "레일리 산란 현상으로 인해 청색광이 산란됩니다.",
        "빛의 파장에 따른 산란 정도가 달라요.",
        "대기 분자와 광자의 상호작용을 비유하면..."
      ]
    },

    // 패널 6-10: 탐구/놀이
    panel_6_10_exploration: {
      excellent: [
        "파란 빛은 통통 튕기며 멀리까지 가요!",
        "빨간 빛은 쭉쭉 뚫고 지나가요.",
        "\"아하! 그래서 파란 빛이 더 많이 보이는 거구나!\"",
        "또봇이 손을 들어 햇빛을 가려봤어요.",
        "그랬더니 하늘색이 조금 달라 보였어요!",
        "저녁이 되자 하늘이 주황색으로 변했어요.",
        "\"파란 빛이 멀리 가버려서 그래!\" 또봇이 알아냈어요."
      ],
      good: [
        "파란 빛이 많이 튕겨요.",
        "저녁에는 하늘이 주황색이에요.",
        "또봇이 실험해봤어요."
      ],
      bad: [
        "산란 강도는 파장의 4제곱에 반비례합니다.",
        "일몰 시 태양광의 경로가 길어져서...",
        "대기를 통과하는 빛의 경로에 따라 색이 변합니다."
      ]
    },

    // 패널 11-12: 마무리
    panel_11_12_ending: {
      excellent: [
        "이제 또봇은 하늘이 왜 파란지 알아요!",
        "\"내일은 무지개의 비밀을 찾아볼까?\"",
        "하늘을 올려다보니 전보다 더 예뻐 보였어요.",
        "또봇이 해님에게 손을 흔들었어요. \"고마워!\"",
        "작은 궁금증이 큰 발견이 되었어요!",
        "다음엔 어떤 비밀을 찾게 될까요?",
        "또봇의 눈이 별처럼 반짝였어요."
      ],
      good: [
        "또봇이 비밀을 알아냈어요.",
        "재미있는 하루였어요.",
        "또봇이 기뻤어요."
      ],
      bad: [
        "이로써 빛의 산란 원리를 학습했습니다.",
        "과학적 탐구 과정이 완료되었어요.",
        "또봇은 새로운 과학 지식을 습득했습니다."
      ]
    }
  }
};

// ============================================
// 비주얼 구도 예시 (패널 위치별)
// ============================================

export interface CompositionExample {
  panel_type: string;
  description: string;
  prompt: string;
  composition_notes: string;
}

export const COMPOSITION_EXAMPLES: CompositionExample[] = [
  {
    panel_type: "hook (패널 1)",
    description: "시선을 사로잡는 첫 장면",
    prompt: "child-friendly illustration, centered composition, cute robot character taking up 50% of frame, looking directly at viewer, big sparkly curious eyes, soft morning light, minimal background with gentle gradient, warm pastel colors",
    composition_notes: "캐릭터 중앙 배치, 50% 크기, 정면 시선, 배경 단순화"
  },
  {
    panel_type: "curiosity (패널 2-3)",
    description: "궁금해하는 캐릭터",
    prompt: "child-friendly illustration, character positioned left third, looking up at sky, tilted head pose, question marks floating above, soft blue sky, generous whitespace on right for text, warm ambient lighting",
    composition_notes: "1/3 지점 배치, 하늘 바라보기, 여백으로 궁금함 표현"
  },
  {
    panel_type: "discovery (패널 4-5)",
    description: "발견의 순간",
    prompt: "child-friendly illustration, character on lower left, magical light rays from upper right, sparkles and glow effects, rainbow colors, character's face lit up with wonder, dynamic composition with diagonal elements",
    composition_notes: "대각선 구도, 빛이 들어오는 방향, 발견 효과"
  },
  {
    panel_type: "exploration (패널 6-10)",
    description: "탐구하는 모습",
    prompt: "child-friendly illustration, medium shot, character interacting with colorful light beams, playful poses, multiple small visual elements showing the process, bright cheerful colors, balanced composition",
    composition_notes: "중간 샷, 상호작용 묘사, 과정 시각화"
  },
  {
    panel_type: "ending (패널 11-12)",
    description: "따뜻한 마무리",
    prompt: "child-friendly illustration, character centered facing viewer, warm golden hour lighting, satisfied happy expression, soft glowing background, cozy atmosphere, heart-warming composition",
    composition_notes: "중앙 배치, 따뜻한 조명, 마무리 분위기"
  }
];

// ============================================
// 프롬프트 빌더에서 사용할 헬퍼 함수들
// ============================================

/**
 * 연령대에 맞는 스토리 예시를 가져옵니다
 */
export const getStoryExamplesForAge = (ageGroup: 'toddler' | 'elementary'): StoryExamples => {
  return STORY_EXAMPLES[ageGroup];
};

/**
 * 안전한 비주얼 예시를 문자열로 포맷팅합니다
 */
export const formatVisualExamplesForPrompt = (): string => {
  const safeExamples = VISUAL_EXAMPLES.safe.slice(0, 2).map(ex =>
    `✅ ${ex.description}:\n   "${ex.prompt}"`
  ).join('\n\n');

  const unsafeExamples = VISUAL_EXAMPLES.unsafe.slice(0, 2).map(ex =>
    `❌ ${ex.description}:\n   "${ex.prompt}"\n   문제: ${ex.why}`
  ).join('\n\n');

  return `## 좋은 예시:\n${safeExamples}\n\n## 나쁜 예시:\n${unsafeExamples}`;
};

/**
 * 스토리 예시를 프롬프트용 문자열로 포맷팅합니다
 */
export const formatStoryExamplesForPrompt = (ageGroup: 'toddler' | 'elementary'): string => {
  const examples = STORY_EXAMPLES[ageGroup];

  const goodExamples = examples.good.slice(0, 2).map(ex =>
    `✅ 주제: "${ex.topic}"\n   "${ex.narrative}"\n   좋은 이유: ${ex.why}`
  ).join('\n\n');

  const badExamples = examples.bad.slice(0, 2).map(ex =>
    `❌ 주제: "${ex.topic}"\n   "${ex.narrative}"\n   나쁜 이유: ${ex.why}`
  ).join('\n\n');

  return `## 좋은 예시:\n${goodExamples}\n\n## 나쁜 예시:\n${badExamples}`;
};

/**
 * 아동 안전 비주얼 프롬프트 접두사
 */
export const CHILD_SAFE_PREFIX =
  "child-friendly illustration, soft rounded shapes, bright cheerful colors, warm inviting atmosphere, suitable for children ages 3-8,";

/**
 * 비주얼 프롬프트에서 금지된 키워드들
 */
export const FORBIDDEN_VISUAL_KEYWORDS = [
  'scary', 'dark', 'shadow', 'creepy', 'horror', 'blood', 'sharp', 'weapon',
  'dangerous', 'threatening', 'sinister', 'eerie', 'gloomy', 'menacing',
  'violent', 'aggressive', 'evil', 'demon', 'monster', 'nightmare',
  'teeth', 'claws', 'fangs', 'skull', 'death', 'dead', 'killing'
];

/**
 * 비주얼 프롬프트가 안전한지 검사합니다
 */
export const isVisualPromptSafe = (prompt: string): { safe: boolean; issues: string[] } => {
  const lowerPrompt = prompt.toLowerCase();
  const issues: string[] = [];

  for (const keyword of FORBIDDEN_VISUAL_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      issues.push(`금지 키워드 발견: "${keyword}"`);
    }
  }

  // 필수 안전 요소 확인
  if (!lowerPrompt.includes('child-friendly')) {
    issues.push('필수 키워드 누락: "child-friendly"');
  }

  return {
    safe: issues.length === 0,
    issues
  };
};

/**
 * 특정 패널 타입의 예시를 가져옵니다
 */
export const getPanelExamples = (
  ageGroup: 'toddler' | 'elementary',
  panelType: keyof PanelExamples
): PanelExampleSet => {
  return PANEL_EXAMPLES[ageGroup][panelType];
};

/**
 * 패널 예시를 프롬프트용 문자열로 포맷팅합니다
 */
export const formatPanelExamplesForPrompt = (
  ageGroup: 'toddler' | 'elementary',
  panelType: keyof PanelExamples
): string => {
  const examples = PANEL_EXAMPLES[ageGroup][panelType];

  const excellentExamples = examples.excellent.slice(0, 5).map((ex, i) =>
    `  ${i + 1}. "${ex}"`
  ).join('\n');

  const badExamples = examples.bad.map((ex, i) =>
    `  ${i + 1}. "${ex}"`
  ).join('\n');

  return `### ✅ 훌륭한 예시:\n${excellentExamples}\n\n### ❌ 피해야 할 예시:\n${badExamples}`;
};

/**
 * 모든 패널 타입의 예시를 한번에 포맷팅합니다
 */
export const formatAllPanelExamplesForPrompt = (
  ageGroup: 'toddler' | 'elementary'
): string => {
  const panelTypes: Array<{ key: keyof PanelExamples; name: string }> = [
    { key: 'panel_1_hook', name: '패널 1 (훅/시작)' },
    { key: 'panel_2_3_curiosity', name: '패널 2-3 (궁금증)' },
    { key: 'panel_4_5_analogy', name: '패널 4-5 (비유 등장)' },
    { key: 'panel_6_10_exploration', name: '패널 6-10 (탐구/놀이)' },
    { key: 'panel_11_12_ending', name: '패널 11-12 (마무리)' }
  ];

  return panelTypes.map(({ key, name }) => {
    const examples = PANEL_EXAMPLES[ageGroup][key];
    const excellent = examples.excellent.slice(0, 3).map(ex => `    ✅ "${ex}"`).join('\n');
    const bad = examples.bad.slice(0, 1).map(ex => `    ❌ "${ex}"`).join('\n');
    return `## ${name}\n${excellent}\n${bad}`;
  }).join('\n\n');
};

/**
 * 구도 예시를 프롬프트용 문자열로 포맷팅합니다
 */
export const formatCompositionExamplesForPrompt = (): string => {
  return COMPOSITION_EXAMPLES.map(ex =>
    `### ${ex.panel_type}\n- 설명: ${ex.description}\n- 구도 포인트: ${ex.composition_notes}\n- 프롬프트: "${ex.prompt.substring(0, 100)}..."`
  ).join('\n\n');
};
