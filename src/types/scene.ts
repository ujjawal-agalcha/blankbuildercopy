export type AvatarType = 'mannequin' | 'male-athletic' | 'female-curvy' | 'hanger' | 'none';

export interface AvatarMeasurements {
  height: number;     // mm, e.g. 1820 mm (182 cm)
  chestCirc: number;  // mm, e.g. 1020 mm (102 cm)
  waistCirc: number;  // mm, e.g. 840 mm
  hipCirc: number;    // mm, e.g. 980 mm
  shoulderWidth: number; // mm, e.g. 460 mm
  armLength: number;  // mm, e.g. 620 mm
  legLength: number;  // mm, e.g. 820 mm
}

export type LightingPreset = 'studio-clean' | 'warm-editorial' | 'dramatic-rim' | 'outdoor-sun' | 'cyberpunk-neon';

export interface SceneSettings {
  avatarType: AvatarType;
  avatarVisible: boolean;
  avatarColor: string;
  avatarMeasurements: AvatarMeasurements;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environmentShadows: boolean;
  wireframe: boolean;
  showSeamLines: boolean;
  backgroundColor: string;
  cameraPreset: 'front' | 'back' | 'left' | 'right' | 'top' | 'perspective';
}

