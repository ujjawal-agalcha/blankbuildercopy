import { create } from 'zustand';
import { PatternPiece, ControlPoint, Edge2D } from '../types/cad';
import { GarmentTemplate, StandardSize } from '../types/garment';
import { GARMENT_TEMPLATES, getTemplateById } from '../garments/catalog';
import { autoArrangePatternPieces, nestPiecesForCutting } from '../geometry/nesting';

interface HistorySnapshot {
  pieces: PatternPiece[];
  measurements: Record<string, number>;
  activeSize: StandardSize;
}

interface GarmentState {
  projectName: string;
  setProjectName: (name: string) => void;

  template: GarmentTemplate;
  activeSize: StandardSize;
  measurements: Record<string, number>;
  pieces: PatternPiece[];

  // Undo / Redo history
  undoStack: HistorySnapshot[];
  redoStack: HistorySnapshot[];

  setTemplate: (templateId: string) => void;
  setActiveSize: (size: StandardSize) => void;
  setMeasurement: (id: string, value: number) => void;
  setMeasurements: (measurements: Record<string, number>) => void;
  
  // Direct CAD editing
  updatePiecePosition: (pieceId: string, x: number, y: number) => void;
  updatePiecePoint: (pieceId: string, pointId: string, newCoords: { x: number; y: number }) => void;
  addPointToEdge: (pieceId: string, edgeId: string, coords: { x: number; y: number }) => void;
  deletePoint: (pieceId: string, pointId: string) => void;
  updateEdgeControlPoint: (pieceId: string, edgeId: string, cpIndex: number, newCoords: { x: number; y: number }) => void;
  addNotchToEdge: (pieceId: string, edgeId: string, distanceRatio: number) => void;
  duplicatePiece: (pieceId: string) => void;
  deletePiece: (pieceId: string) => void;
  mirrorPiece: (pieceId: string) => void;
  rotatePiece: (pieceId: string, angleDelta: number) => void;
  resetPatternLayout: () => void;
  arrangeAllPieces: () => void;
  nestAllPieces: () => void;
  updateControlHandle: (pieceId: string, pointId: string, handleType: 'in' | 'out', coords: { x: number; y: number }) => void;
  togglePieceSeamAllowance: (pieceId: string) => void;
  setPieceSeamAllowanceWidth: (pieceId: string, widthMm: number) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Project persistence
  saveProjectToStorage: () => void;
  loadProjectFromStorage: () => boolean;
}

const initialTemplate = GARMENT_TEMPLATES[1]; // Oversized T-shirt
const initialMeasurements: Record<string, number> = {};
initialTemplate.measurements.forEach((m) => {
  initialMeasurements[m.id] = m.value;
});
const initialPieces = initialTemplate.generatePatterns(initialMeasurements);

export const useGarmentStore = create<GarmentState>((set, get) => ({
  projectName: 'OVERSIZED T-SHIRT 2026',
  setProjectName: (projectName) => set({ projectName }),

  template: initialTemplate,
  activeSize: 'M',
  measurements: initialMeasurements,
  pieces: initialPieces,

  undoStack: [],
  redoStack: [],
  canUndo: false,
  canRedo: false,

  setTemplate: (templateId) => {
    const nextTemplate = getTemplateById(templateId);
    const measurements: Record<string, number> = {};
    nextTemplate.measurements.forEach((m) => {
      measurements[m.id] = m.value;
    });
    const pieces = nextTemplate.generatePatterns(measurements);
    set({
      template: nextTemplate,
      measurements,
      pieces,
      activeSize: 'M',
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
    });
  },

  setActiveSize: (size) => {
    const { template } = get();
    const baseMeasurements: Record<string, number> = {};
    template.measurements.forEach((m) => {
      baseMeasurements[m.id] = m.value;
    });

    const rule = template.gradingRules.find((r) => r.size === size);
    const newMeasurements = { ...baseMeasurements };
    if (rule) {
      Object.entries(rule.measurementDeltas).forEach(([key, delta]) => {
        if (newMeasurements[key] !== undefined) {
          newMeasurements[key] += delta;
        }
      });
    }

    const { pieces: oldPieces, measurements: oldMeasurements, activeSize: oldSize, undoStack } = get();
    const newPieces = template.generatePatterns(newMeasurements);

    // Preserve piece positions and rotations
    const adjustedPieces = newPieces.map((np) => {
      const match = oldPieces.find((op) => op.id === np.id);
      return match ? { ...np, position: match.position, rotation: match.rotation } : np;
    });

    set({
      activeSize: size,
      measurements: newMeasurements,
      pieces: adjustedPieces,
      undoStack: [...undoStack, { pieces: oldPieces, measurements: oldMeasurements, activeSize: oldSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  setMeasurement: (id, value) => {
    const { template, measurements, pieces: oldPieces, activeSize, undoStack } = get();
    const newMeasurements = { ...measurements, [id]: value };
    const newPieces = template.generatePatterns(newMeasurements);

    // Preserve piece positions and rotations
    const adjustedPieces = newPieces.map((np) => {
      const match = oldPieces.find((op) => op.id === np.id);
      return match ? { ...np, position: match.position, rotation: match.rotation } : np;
    });

    set({
      measurements: newMeasurements,
      pieces: adjustedPieces,
      undoStack: [...undoStack, { pieces: oldPieces, measurements, activeSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  setMeasurements: (newMeasurements) => {
    const { template, pieces: oldPieces } = get();
    const newPieces = template.generatePatterns(newMeasurements);
    const adjustedPieces = newPieces.map((np) => {
      const match = oldPieces.find((op) => op.id === np.id);
      return match ? { ...np, position: match.position, rotation: match.rotation } : np;
    });
    set({ measurements: newMeasurements, pieces: adjustedPieces });
  },

  updatePiecePosition: (pieceId, x, y) => {
    set((state) => ({
      pieces: state.pieces.map((p) => (p.id === pieceId ? { ...p, position: { x, y } } : p)),
    }));
  },

  updatePiecePoint: (pieceId, pointId, newCoords) => {
    const { pieces, measurements, activeSize, undoStack } = get();
    const updated = pieces.map((piece) => {
      if (piece.id !== pieceId) return piece;
      return {
        ...piece,
        points: piece.points.map((pt) => (pt.id === pointId ? { ...pt, ...newCoords } : pt)),
      };
    });

    set({
      pieces: updated,
      undoStack: [...undoStack, { pieces, measurements, activeSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  addPointToEdge: (pieceId, edgeId, coords) => {
    const { pieces, measurements, activeSize, undoStack } = get();
    const newPtId = `pt_${Date.now()}`;
    const newPt: ControlPoint = { id: newPtId, x: coords.x, y: coords.y, type: 'corner' };

    const updated = pieces.map((piece) => {
      if (piece.id !== pieceId) return piece;
      const edgeIndex = piece.edges.findIndex((e) => e.id === edgeId);
      if (edgeIndex === -1) return piece;

      const oldEdge = piece.edges[edgeIndex];
      const edge1: Edge2D = {
        ...oldEdge,
        id: `${oldEdge.id}_a`,
        toPointId: newPtId,
        type: 'line',
      };
      const edge2: Edge2D = {
        ...oldEdge,
        id: `${oldEdge.id}_b`,
        fromPointId: newPtId,
        type: 'line',
      };

      const newEdges = [...piece.edges];
      newEdges.splice(edgeIndex, 1, edge1, edge2);

      return {
        ...piece,
        points: [...piece.points, newPt],
        edges: newEdges,
      };
    });

    set({
      pieces: updated,
      undoStack: [...undoStack, { pieces, measurements, activeSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  deletePoint: (pieceId, pointId) => {
    const { pieces, measurements, activeSize, undoStack } = get();
    const updated = pieces.map((piece) => {
      if (piece.id !== pieceId || piece.points.length <= 3) return piece;
      return {
        ...piece,
        points: piece.points.filter((pt) => pt.id !== pointId),
      };
    });

    set({
      pieces: updated,
      undoStack: [...undoStack, { pieces, measurements, activeSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  updateEdgeControlPoint: (pieceId, edgeId, cpIndex, newCoords) => {
    set((state) => ({
      pieces: state.pieces.map((piece) => {
        if (piece.id !== pieceId) return piece;
        return {
          ...piece,
          edges: piece.edges.map((edge) => {
            if (edge.id !== edgeId || !edge.controlPoints) return edge;
            const updatedCps = [...edge.controlPoints];
            updatedCps[cpIndex] = newCoords;
            return { ...edge, controlPoints: updatedCps };
          }),
        };
      }),
    }));
  },

  addNotchToEdge: (pieceId, edgeId, distanceRatio) => {
    const newNotchId = `notch_${Date.now()}`;
    set((state) => ({
      pieces: state.pieces.map((piece) => {
        if (piece.id !== pieceId) return piece;
        return {
          ...piece,
          notches: [
            ...piece.notches,
            {
              id: newNotchId,
              edgeId,
              distanceRatio: Math.max(0.05, Math.min(0.95, distanceRatio)),
              type: 'single',
              depth: 5,
            },
          ],
        };
      }),
    }));
  },

  duplicatePiece: (pieceId) => {
    const { pieces } = get();
    const source = pieces.find((p) => p.id === pieceId);
    if (!source) return;
    const newId = `${source.id}_copy_${Date.now().toString().slice(-4)}`;
    const cloned: PatternPiece = {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      position: { x: source.position.x + 80, y: source.position.y + 80 },
    };
    set({ pieces: [...pieces, cloned] });
  },

  deletePiece: (pieceId) => {
    const { pieces } = get();
    if (pieces.length <= 1) return; // Keep at least one piece
    set({ pieces: pieces.filter((p) => p.id !== pieceId) });
  },

  mirrorPiece: (pieceId) => {
    set((state) => ({
      pieces: state.pieces.map((piece) => {
        if (piece.id !== pieceId) return piece;
        return {
          ...piece,
          points: piece.points.map((pt) => ({ ...pt, x: -pt.x })),
          edges: piece.edges.map((edge) => {
            if (!edge.controlPoints) return edge;
            return {
              ...edge,
              controlPoints: edge.controlPoints.map((cp) => ({ ...cp, x: -cp.x })),
            };
          }),
        };
      }),
    }));
  },

  rotatePiece: (pieceId, angleDelta) => {
    set((state) => ({
      pieces: state.pieces.map((p) =>
        p.id === pieceId ? { ...p, rotation: (p.rotation + angleDelta) % 360 } : p
      ),
    }));
  },

  resetPatternLayout: () => {
    const { template, measurements } = get();
    const freshPieces = template.generatePatterns(measurements);
    set({ pieces: freshPieces });
  },

  arrangeAllPieces: () => {
    const { pieces, measurements, activeSize, undoStack } = get();
    const arranged = autoArrangePatternPieces(pieces, 50, 70);
    set({
      pieces: arranged,
      undoStack: [...undoStack, { pieces, measurements, activeSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  nestAllPieces: () => {
    const { pieces, measurements, activeSize, undoStack } = get();
    const nested = nestPiecesForCutting(pieces, 1450, 25);
    set({
      pieces: nested.pieces,
      undoStack: [...undoStack, { pieces, measurements, activeSize }],
      redoStack: [],
      canUndo: true,
      canRedo: false,
    });
  },

  updateControlHandle: (pieceId, pointId, handleType, coords) => {
    set((state) => ({
      pieces: state.pieces.map((piece) => {
        if (piece.id !== pieceId) return piece;
        return {
          ...piece,
          points: piece.points.map((pt) => {
            if (pt.id !== pointId) return pt;
            if (handleType === 'in') return { ...pt, handleIn: coords };
            return { ...pt, handleOut: coords };
          }),
        };
      }),
    }));
  },

  togglePieceSeamAllowance: (pieceId) => {
    set((state) => ({
      pieces: state.pieces.map((p) =>
        p.id === pieceId ? { ...p, seamAllowanceEnabled: !p.seamAllowanceEnabled } : p
      ),
    }));
  },

  setPieceSeamAllowanceWidth: (pieceId, widthMm) => {
    set((state) => ({
      pieces: state.pieces.map((p) =>
        p.id === pieceId ? { ...p, defaultSeamAllowance: widthMm } : p
      ),
    }));
  },

  undo: () => {
    const { undoStack, redoStack, pieces, measurements, activeSize } = get();
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    set({
      pieces: previous.pieces,
      measurements: previous.measurements,
      activeSize: previous.activeSize,
      undoStack: newUndoStack,
      redoStack: [...redoStack, { pieces, measurements, activeSize }],
      canUndo: newUndoStack.length > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const { undoStack, redoStack, pieces, measurements, activeSize } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    set({
      pieces: next.pieces,
      measurements: next.measurements,
      activeSize: next.activeSize,
      undoStack: [...undoStack, { pieces, measurements, activeSize }],
      redoStack: newRedoStack,
      canUndo: true,
      canRedo: newRedoStack.length > 0,
    });
  },

  saveProjectToStorage: () => {
    const state = get();
    const data = {
      projectName: state.projectName,
      templateId: state.template.id,
      activeSize: state.activeSize,
      measurements: state.measurements,
      pieces: state.pieces,
    };
    try {
      localStorage.setItem('threadcad_project', JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  loadProjectFromStorage: () => {
    try {
      const raw = localStorage.getItem('threadcad_project');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.templateId) {
        const t = getTemplateById(data.templateId);
        set({
          projectName: data.projectName || 'My Project',
          template: t,
          activeSize: data.activeSize || 'M',
          measurements: data.measurements || {},
          pieces: data.pieces || t.generatePatterns(data.measurements || {}),
        });
        return true;
      }
    } catch (e) {
      console.error('Error loading project from storage:', e);
    }
    return false;
  },
}));
