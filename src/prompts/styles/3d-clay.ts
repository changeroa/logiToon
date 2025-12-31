
import { LIGHTING, TEXTURE, CAMERA } from './components';
import { StyleConfig } from '../types';

export const STYLE_3D_CLAY: StyleConfig = {
  name: "3D Animation", // UI에는 "3D Animation"으로 표시 (저작권 회피)
  description: "Cinematic, warm, golden hour 3D animation.",
  prompt: [
    "Disney Pixar style 3D animated still", // 내부는 고품질 생성을 위해 구체적 키워드 사용
    LIGHTING['golden-hour'],
    TEXTURE['tactile'],
    "Photorealistic rendering within a stylized 3D world",
    CAMERA['shallow-dof']
  ].join('. ') + '.',
  ui: {
    color: "bg-orange-100 text-orange-700"
  }
};
