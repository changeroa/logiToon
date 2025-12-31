import { LIGHTING, TEXTURE, CAMERA } from './components';
import { StyleConfig } from '../types';

export const STYLE_WATERCOLOR: StyleConfig = {
  name: "Soft Watercolor",
  description: "Dreamy, artistic, gentle textures.",
  prompt: [
    "Soft watercolor painting, storybook illustration",
    "wet-on-wet technique",
    TEXTURE['rough'],
    "gentle pastel colors, ink outlines",
    LIGHTING['soft-ambient'],
    "dreamy atmosphere, detailed and delicate"
  ].join(', ') + '.',
  ui: {
    color: "bg-blue-100 text-blue-700"
  }
};
