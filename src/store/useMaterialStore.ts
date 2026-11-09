import { create } from 'zustand';
import { FabricMaterial } from '../types/material';
import { FABRIC_LIBRARY } from '../materials/library';

interface MaterialState {
  material: FabricMaterial;
  setMaterial: (mat: FabricMaterial) => void;
  setMaterialById: (id: string) => void;
  setColor: (colorHex: string) => void;
  updatePbr: (pbr: Partial<FabricMaterial['pbr']>) => void;
  updatePhysics: (physics: Partial<FabricMaterial['physics']>) => void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  material: FABRIC_LIBRARY[1], // Vintage Heavyweight Cotton
  setMaterial: (material) => set({ material }),
  setMaterialById: (id) => {
    const found = FABRIC_LIBRARY.find((m) => m.id === id);
    if (found) set({ material: found });
  },
  setColor: (baseColor) =>
    set((state) => ({ material: { ...state.material, baseColor } })),
  updatePbr: (pbrUpdates) =>
    set((state) => ({
      material: {
        ...state.material,
        pbr: { ...state.material.pbr, ...pbrUpdates },
      },
    })),
  updatePhysics: (physicsUpdates) =>
    set((state) => ({
      material: {
        ...state.material,
        physics: { ...state.material.physics, ...physicsUpdates },
      },
    })),
}));

