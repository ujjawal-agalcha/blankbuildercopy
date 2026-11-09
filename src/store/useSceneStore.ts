import { create } from 'zustand';
import { SceneSettings, AvatarType, LightingPreset } from '../types/scene';

interface SceneState {
  settings: SceneSettings;
  updateSettings: (updates: Partial<SceneSettings>) => void;
  setAvatarType: (avatarType: AvatarType) => void;
  setLightingPreset: (lightingPreset: LightingPreset) => void;
  setCameraPreset: (cameraPreset: SceneSettings['cameraPreset']) => void;
  toggleWireframe: () => void;
  toggleSeamLines: () => void;
}

const defaultSceneSettings: SceneSettings = {
  avatarType: 'mannequin',
  avatarVisible: true,
  avatarColor: '#2b2f3a',
  avatarMeasurements: {
    height: 1820,
    chestCirc: 1020,
    waistCirc: 840,
    hipCirc: 980,
    shoulderWidth: 460,
    armLength: 620,
    legLength: 820,
  },
  lightingPreset: 'studio-clean',
  lightIntensity: 1.2,
  environmentShadows: true,
  wireframe: false,
  showSeamLines: true,
  backgroundColor: '#12141a',
  cameraPreset: 'perspective',
};

export const useSceneStore = create<SceneState>((set) => ({
  settings: defaultSceneSettings,
  updateSettings: (updates) =>
    set((state) => ({ settings: { ...state.settings, ...updates } })),
  setAvatarType: (avatarType) =>
    set((state) => ({ settings: { ...state.settings, avatarType } })),
  setLightingPreset: (lightingPreset) =>
    set((state) => ({ settings: { ...state.settings, lightingPreset } })),
  setCameraPreset: (cameraPreset) =>
    set((state) => ({ settings: { ...state.settings, cameraPreset } })),
  toggleWireframe: () =>
    set((state) => ({
      settings: { ...state.settings, wireframe: !state.settings.wireframe },
    })),
  toggleSeamLines: () =>
    set((state) => ({
      settings: { ...state.settings, showSeamLines: !state.settings.showSeamLines },
    })),
}));

