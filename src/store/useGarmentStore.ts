import { create } from 'zustand';
import { PatternPiece, ControlPoint } from '../types/cad';
import { GarmentTemplate, StandardSize } from '../types/garment';
import { GARMENT_TEMPLATES, getTemplateById } from '../garments/catalog';

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
  updateEdgeControlPoint: (pieceId: string, edgeId: string, cpIndex: number, newCoords: { x: number; y: number }) => void;
  addNotchToEdge: (pieceId: string, edgeId: string, distanceRatio: number) => void;
  duplicatePiece: (pieceId: string) => void;
  mirrorPiece: (pieceId: string) => void;
  rotatePiece: (pieceId: string, angleDelta: number) => void;
  updateControlHandle: (pieceId: string, pointId: string, handleType: 'in' | 'out', coords: { x: number; y: number }) => void;
  togglePieceSeamAllowance: (pieceId: string) => void;
  setPieceSeamAllowanceWidth: (pieceId: string, widthMm: number) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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

    // Preserve piece positions
    const adjustedPieces = newPieces.map((np) => {
      const match = oldPieces.find((op) => op.id === np.id);
      return match ? { ...np, position: match.position } : np;
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

    // Preserve positions
    const adjustedPieces = newPieces.map((np) => {
      const match = oldPieces.find((op) => op.id === np.id);
      return match ? { ...np, position: match.position } : np;
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
      return match ? { ...np, position: match.position } : np;
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

  mirrorPiece: (pieceId) => {
    set((state) => ({
      pieces: state.pieces.map((piece) => {
        if (piece.id !== pieceId) return piece;
        // Invert X coordinates
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
}));

