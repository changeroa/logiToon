import { LIGHTING, TEXTURE, CAMERA } from './components';
import { StyleConfig } from '../types';

export const STYLE_PAPER_CUTOUT: StyleConfig = {
  name: "Paper Craft",
  description: "Abstract, layered depth, creative.",
  prompt: [
    "Layered paper craft illustration, diorama style",
    CAMERA['shallow-dof'],
    TEXTURE['paper'],
    "drop shadows between layers, intricate paper cutting",
    "origami elements",
    LIGHTING['soft-ambient']
  ].join(', ') + '.',
  ui: {
    color: "bg-rose-100 text-rose-700"
  }
};
