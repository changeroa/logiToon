
import { LIGHTING, TEXTURE, CAMERA } from './components';
import { StyleConfig } from '../types';

export const STYLE_GHIBLI_ANIME: StyleConfig = {
  name: "Cinematic Anime", // UI에는 "Cinematic Anime"로 표시
  description: "Vibrant, lush details, cinematic skies.",
  prompt: [
    "Studio Ghibli movie style", // 내부는 고품질 생성을 위해 구체적 키워드 사용
    "cel shaded, hand-drawn background",
    "lush details",
    "vibrant colors, cumulus clouds",
    LIGHTING['golden-hour'],
    "cinematic composition, masterpiece, 4k"
  ].join(', ') + '.',
  ui: {
    color: "bg-emerald-100 text-emerald-700"
  }
};
