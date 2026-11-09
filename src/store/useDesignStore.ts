import { create } from 'zustand';
import { ArtworkLayer, PlacementZone, PrintTechnique } from '../types/artwork';

interface DesignState {
  layers: ArtworkLayer[];
  activeLayerId: string | null;

  setActiveLayerId: (id: string | null) => void;
  addTextLayer: (zone?: PlacementZone) => void;
  addImageLayer: (imageUrl: string, name?: string, zone?: PlacementZone) => void;
  updateLayer: (id: string, updates: Partial<ArtworkLayer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayer: (id: string, direction: 'up' | 'down') => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
}

const initialLayers: ArtworkLayer[] = [
  {
    id: 'layer_sample_front',
    name: 'ATHLETIC ARCH',
    type: 'text',
    zone: 'front-chest',
    x: 0,
    y: -30,
    scale: 1.0,
    rotation: 0,
    opacity: 1.0,
    technique: 'puff-print',
    text: 'PARIS ATHLETICS',
    fontFamily: 'Bebas Neue',
    fontSize: 48,
    textColor: '#ffffff',
    letterSpacing: 4,
    puffElevation: 1.5,
    visible: true,
    locked: false,
  },
  {
    id: 'layer_sample_subtext',
    name: 'EST. 2026 TEXT',
    type: 'text',
    zone: 'front-chest',
    x: 0,
    y: 25,
    scale: 0.8,
    rotation: 0,
    opacity: 0.85,
    technique: 'screen-print',
    text: 'EST. 2026 • STUDIO EDITION',
    fontFamily: 'Inter',
    fontSize: 14,
    textColor: '#10b981',
    letterSpacing: 6,
    visible: true,
    locked: false,
  },
];

export const useDesignStore = create<DesignState>((set, get) => ({
  layers: initialLayers,
  activeLayerId: 'layer_sample_front',

  setActiveLayerId: (activeLayerId) => set({ activeLayerId }),

  addTextLayer: (zone = 'front-chest') => {
    const newId = `layer_${Date.now()}`;
    const newLayer: ArtworkLayer = {
      id: newId,
      name: 'Custom Typography',
      type: 'text',
      zone,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      technique: 'screen-print',
      text: 'DESIGN STUDIO',
      fontFamily: 'Montserrat',
      fontSize: 32,
      textColor: '#f1f5f9',
      letterSpacing: 2,
      visible: true,
      locked: false,
    };
    set((state) => ({
      layers: [newLayer, ...state.layers],
      activeLayerId: newId,
    }));
  },

  addImageLayer: (imageUrl, name = 'Graphic Artwork', zone = 'front-chest') => {
    const newId = `layer_${Date.now()}`;
    const newLayer: ArtworkLayer = {
      id: newId,
      name,
      type: 'image',
      zone,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      technique: 'dtg',
      imageUrl,
      visible: true,
      locked: false,
    };
    set((state) => ({
      layers: [newLayer, ...state.layers],
      activeLayerId: newId,
    }));
  },

  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)),
    }));
  },

  removeLayer: (id) => {
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      activeLayerId: state.activeLayerId === id ? null : state.activeLayerId,
    }));
  },

  duplicateLayer: (id) => {
    const { layers } = get();
    const source = layers.find((l) => l.id === id);
    if (!source) return;
    const clone: ArtworkLayer = {
      ...source,
      id: `layer_${Date.now()}`,
      name: `${source.name} Copy`,
      x: source.x + 10,
      y: source.y + 10,
    };
    set({ layers: [clone, ...layers], activeLayerId: clone.id });
  },

  reorderLayer: (id, direction) => {
    const { layers } = get();
    const index = layers.findIndex((l) => l.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layers.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newLayers = [...layers];
    const [moved] = newLayers.splice(index, 1);
    newLayers.splice(targetIndex, 0, moved);

    set({ layers: newLayers });
  },

  toggleLayerVisibility: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    }));
  },

  toggleLayerLock: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)),
    }));
  },
}));

