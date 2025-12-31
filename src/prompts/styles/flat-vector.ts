import { LIGHTING, TEXTURE, CAMERA } from './components';
import { StyleConfig } from '../types';

export const STYLE_FLAT_VECTOR: StyleConfig = {
  name: "Modern Vector",
  description: "Clean, geometric, bold colors.",
  prompt: [
    "Modern flat vector art, behance style",
    "geometric shapes, clean lines",
    "minimal gradients, vibrant and bold colors",
    "corporate memphis art style, vector illustration",
    LIGHTING['flat'],
    TEXTURE['smooth']
  ].join(', ') + '.',
  ui: {
    color: "bg-indigo-100 text-indigo-700"
  }
};
