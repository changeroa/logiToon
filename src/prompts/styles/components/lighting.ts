// Reusable lighting component definitions for visual prompts

export const LIGHTING = {
  'golden-hour': 'warm golden hour lighting, long soft shadows, sun low on horizon',
  'soft-ambient': 'soft ambient lighting, no harsh shadows, evenly lit',
  'dramatic': 'dramatic chiaroscuro lighting, strong contrast, deep shadows',
  'flat': 'flat even lighting, minimal shadows, bright and clear',
  'moonlit': 'cool moonlight, blue tones, gentle night glow',
  'sunrise': 'early morning light, pink and orange hues, misty atmosphere',
  'studio': 'professional studio lighting, three-point setup, clean highlights',
  'neon': 'neon lighting, vibrant glows, cyberpunk atmosphere',
  'candlelight': 'warm candlelight, flickering, intimate and cozy'
} as const;

export type LightingKey = keyof typeof LIGHTING;

export const getLighting = (key: LightingKey): string => LIGHTING[key];
