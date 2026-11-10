import { create } from 'zustand';
import { ArtworkLayer, PlacementZone, PrintTechnique, UploadedAsset } from '../types/artwork';
import { imageCache } from '../services/imageCache';

interface DesignState {
  // Uploaded Asset Library
  assets: UploadedAsset[];
  uploadAsset: (file: File) => Promise<UploadedAsset>;
  removeAsset: (assetId: string) => void;

  // Active artwork layers on garment
  layers: ArtworkLayer[];
  activeLayerId: string | null;

  setActiveLayerId: (id: string | null) => void;
  addTextLayer: (pieceId?: string, text?: string) => void;
  addImageLayerFromAsset: (assetId: string, pieceId?: string) => void;
  addImageLayerDirect: (imageUrl: string, name?: string, pieceId?: string) => Promise<void>;
  updateLayer: (id: string, updates: Partial<ArtworkLayer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayer: (id: string, direction: 'up' | 'down') => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;

  // Transformations
  flipLayerH: (id: string) => void;
  flipLayerV: (id: string) => void;
  alignLayer: (id: string, alignH?: 'left' | 'center' | 'right', alignV?: 'top' | 'center' | 'bottom') => void;

  // Clear or load demo content
  clearAllLayers: () => void;
  loadDemoContent: () => void;
}

let layerCounter = 0;
const generateLayerId = (prefix = 'layer') =>
  `${prefix}_${Date.now()}_${++layerCounter}_${Math.random().toString(36).substring(2, 7)}`;

export const useDesignStore = create<DesignState>((set, get) => ({
  assets: [],
  layers: [], // Starts clean - no automatic graphics!
  activeLayerId: null,

  uploadAsset: async (file: File) => {
    return new Promise<UploadedAsset>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        try {
          const img = await imageCache.preloadImage(dataUrl);
          const asset: UploadedAsset = {
            id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            dataUrl,
            width: img.naturalWidth || 800,
            height: img.naturalHeight || 800,
            aspectRatio: (img.naturalWidth || 1) / (img.naturalHeight || 1),
            fileType: file.type || 'image/png',
            fileSize: file.size,
            uploadedAt: Date.now(),
          };

          set((state) => ({
            assets: [asset, ...state.assets],
          }));

          resolve(asset);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  removeAsset: (assetId: string) => {
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== assetId),
    }));
  },

  setActiveLayerId: (activeLayerId) => set({ activeLayerId }),

  addTextLayer: (pieceId = 'piece_front_body', text = 'CUSTOM TEXT') => {
    const newId = generateLayerId();
    const newLayer: ArtworkLayer = {
      id: newId,
      name: text,
      type: 'text',
      pieceId,
      zone: 'front-chest',
      x: 0,
      y: 0,
      width: 200,
      height: 50,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      technique: 'screen-print',
      text,
      fontFamily: 'Inter',
      fontSize: 36,
      textColor: '#ffffff',
      letterSpacing: 2,
      visible: true,
      locked: false,
      flipH: false,
      flipV: false,
      aspectRatioLocked: true,
    };

    set((state) => ({
      layers: [newLayer, ...state.layers],
      activeLayerId: newId,
    }));
  },

  addImageLayerFromAsset: (assetId: string, pieceId = 'piece_front_body') => {
    const { assets } = get();
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    const newId = generateLayerId();
    const targetW = 220; // 220 mm default width on garment
    const targetH = targetW / asset.aspectRatio;

    const newLayer: ArtworkLayer = {
      id: newId,
      name: asset.name,
      type: 'image',
      pieceId,
      zone: 'front-chest',
      x: 0,
      y: 0,
      width: Math.round(targetW),
      height: Math.round(targetH),
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      technique: 'dtg',
      imageUrl: asset.dataUrl,
      originalWidth: asset.width,
      originalHeight: asset.height,
      aspectRatio: asset.aspectRatio,
      aspectRatioLocked: true,
      visible: true,
      locked: false,
      flipH: false,
      flipV: false,
    };

    set((state) => ({
      layers: [newLayer, ...state.layers],
      activeLayerId: newId,
    }));
  },

  addImageLayerDirect: async (imageUrl: string, name = 'Uploaded Graphic', pieceId = 'piece_front_body') => {
    const img = await imageCache.preloadImage(imageUrl);
    const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
    const targetW = 220;
    const targetH = targetW / aspect;

    const newId = generateLayerId();
    const newLayer: ArtworkLayer = {
      id: newId,
      name,
      type: 'image',
      pieceId,
      zone: 'front-chest',
      x: 0,
      y: 0,
      width: Math.round(targetW),
      height: Math.round(targetH),
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      technique: 'dtg',
      imageUrl,
      originalWidth: img.naturalWidth,
      originalHeight: img.naturalHeight,
      aspectRatio: aspect,
      aspectRatioLocked: true,
      visible: true,
      locked: false,
      flipH: false,
      flipV: false,
    };

    set((state) => ({
      layers: [newLayer, ...state.layers],
      activeLayerId: newId,
    }));
  },

  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer;

        const updated = { ...layer, ...updates };

        // Handle aspect ratio lock during width or height update
        if (layer.aspectRatioLocked && layer.aspectRatio) {
          if (updates.width !== undefined && updates.height === undefined) {
            updated.height = Math.round(updates.width / layer.aspectRatio);
          } else if (updates.height !== undefined && updates.width === undefined) {
            updated.width = Math.round(updates.height * layer.aspectRatio);
          }
        }

        return updated;
      }),
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
      id: generateLayerId('layer_dup'),
      name: `${source.name} Copy`,
      x: source.x + 15,
      y: source.y + 15,
    };
    set({ layers: [clone, ...layers], activeLayerId: clone.id });
  },

  reorderLayer: (id, direction) => {
    const { layers } = get();
    const index = layers.findIndex((l) => l.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layers.length - 1) return;

    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newLayers[index];
    newLayers[index] = newLayers[targetIndex];
    newLayers[targetIndex] = temp;

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

  flipLayerH: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, flipH: !l.flipH } : l)),
    }));
  },

  flipLayerV: (id) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, flipV: !l.flipV } : l)),
    }));
  },

  alignLayer: (id, alignH, alignV) => {
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id !== id) return l;
        let newX = l.x;
        let newY = l.y;
        if (alignH === 'left') newX = -100;
        else if (alignH === 'center') newX = 0;
        else if (alignH === 'right') newX = 100;

        if (alignV === 'top') newY = -120;
        else if (alignV === 'center') newY = 0;
        else if (alignV === 'bottom') newY = 120;

        return { ...l, x: newX, y: newY, alignH, alignV };
      }),
    }));
  },

  clearAllLayers: () => {
    set({ layers: [], activeLayerId: null });
  },

  loadDemoContent: () => {
    const demoLayers: ArtworkLayer[] = [
      {
        id: 'layer_demo_front',
        name: 'PARIS ATHLETICS',
        type: 'text',
        pieceId: 'piece_front_body',
        zone: 'front-chest',
        x: 0,
        y: -40,
        width: 240,
        height: 50,
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
        flipH: false,
        flipV: false,
        aspectRatioLocked: true,
      },
      {
        id: 'layer_demo_subtext',
        name: 'STUDIO EDITION',
        type: 'text',
        pieceId: 'piece_front_body',
        zone: 'front-chest',
        x: 0,
        y: 20,
        width: 200,
        height: 25,
        scale: 0.85,
        rotation: 0,
        opacity: 0.9,
        technique: 'screen-print',
        text: 'EST. 2026 • STUDIO EDITION',
        fontFamily: 'Inter',
        fontSize: 14,
        textColor: '#10b981',
        letterSpacing: 5,
        visible: true,
        locked: false,
        flipH: false,
        flipV: false,
        aspectRatioLocked: true,
      },
    ];

    set({ layers: demoLayers, activeLayerId: 'layer_demo_front' });
  },
}));
