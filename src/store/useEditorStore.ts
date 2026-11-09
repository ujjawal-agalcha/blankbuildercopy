import { create } from 'zustand';
import { CadTool, Unit, ViewportTransform } from '../types/cad';

export type ViewMode = 'split' | '2d-only' | '3d-only';
export type RightPanelTab = 'design' | 'fabric' | 'sewing' | 'scene';

interface EditorState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  activeTab: RightPanelTab;
  setActiveTab: (tab: RightPanelTab) => void;

  activeTool: CadTool;
  setActiveTool: (tool: CadTool) => void;

  unit: Unit;
  setUnit: (unit: Unit) => void;

  selectedPieceId: string | null;
  setSelectedPieceId: (id: string | null) => void;

  selectedPointId: string | null;
  setSelectedPointId: (id: string | null) => void;

  selectedEdgeId: string | null;
  setSelectedEdgeId: (id: string | null) => void;

  viewport: ViewportTransform;
  setViewport: (transform: Partial<ViewportTransform>) => void;
  resetViewport: () => void;

  gridSnap: boolean;
  setGridSnap: (snap: boolean) => void;
  gridSize: number; // in mm

  showSeamAllowance: boolean;
  setShowSeamAllowance: (show: boolean) => void;

  showGrainlines: boolean;
  setShowGrainlines: (show: boolean) => void;

  showNotches: boolean;
  setShowNotches: (show: boolean) => void;

  showDimensions: boolean;
  setShowDimensions: (show: boolean) => void;

  // Sewing interaction pending edge
  pendingSewEdge: { pieceId: string; edgeId: string } | null;
  setPendingSewEdge: (edge: { pieceId: string; edgeId: string } | null) => void;

  // Cursor coordinates in world space (mm)
  cursorCoords: { x: number; y: number };
  setCursorCoords: (coords: { x: number; y: number }) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  viewMode: 'split',
  setViewMode: (viewMode) => set({ viewMode }),

  activeTab: 'design',
  setActiveTab: (activeTab) => set({ activeTab }),

  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool, pendingSewEdge: null }),

  unit: 'cm',
  setUnit: (unit) => set({ unit }),

  selectedPieceId: 'piece_front_body',
  setSelectedPieceId: (selectedPieceId) => set({ selectedPieceId, selectedPointId: null, selectedEdgeId: null }),

  selectedPointId: null,
  setSelectedPointId: (selectedPointId) => set({ selectedPointId }),

  selectedEdgeId: null,
  setSelectedEdgeId: (selectedEdgeId) => set({ selectedEdgeId }),

  viewport: { x: 50, y: 50, zoom: 0.65 },
  setViewport: (transform) =>
    set((state) => ({ viewport: { ...state.viewport, ...transform } })),
  resetViewport: () => set({ viewport: { x: 50, y: 50, zoom: 0.65 } }),

  gridSnap: true,
  setGridSnap: (gridSnap) => set({ gridSnap }),
  gridSize: 10, // 10mm = 1cm

  showSeamAllowance: true,
  setShowSeamAllowance: (showSeamAllowance) => set({ showSeamAllowance }),

  showGrainlines: true,
  setShowGrainlines: (showGrainlines) => set({ showGrainlines }),

  showNotches: true,
  setShowNotches: (showNotches) => set({ showNotches }),

  showDimensions: true,
  setShowDimensions: (showDimensions) => set({ showDimensions }),

  pendingSewEdge: null,
  setPendingSewEdge: (pendingSewEdge) => set({ pendingSewEdge }),

  cursorCoords: { x: 0, y: 0 },
  setCursorCoords: (cursorCoords) => set({ cursorCoords }),
}));

