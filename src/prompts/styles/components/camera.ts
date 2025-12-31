
// Reusable camera/lens component definitions for visual prompts

export const CAMERA = {
  'shallow-dof': 'shallow depth of field, bokeh background, subject isolation',
  'deep-focus': 'deep focus, everything sharp, detailed background',
  'tilt-shift': 'tilt-shift miniature effect, selective focus band, toy-like scale',
  'macro': 'macro lens, extreme close-up, giant details, bug\'s eye view',
  'wide-angle': 'wide angle lens, expansive view, slight distortion, epic scale',
  'telephoto': 'telephoto compression, flattened perspective, intimate',
  'fisheye': 'fisheye lens, spherical distortion, dynamic energy, playful curvature',
  'anamorphic': 'anamorphic lens, cinematic aspect ratio, lens flares',
  'isometric': 'isometric view, 3/4 top-down angle, diorama style, clear layout',
  'worms-eye': 'low angle looking up, worm\'s eye view, towering subjects, imposing scale',
  'birds-eye': 'high angle looking down, bird\'s eye view, map-like layout, overview context'
} as const;

export type CameraKey = keyof typeof CAMERA;

export const getCamera = (key: CameraKey): string => CAMERA[key];
