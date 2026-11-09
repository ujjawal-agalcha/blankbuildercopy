import { create } from 'zustand';
import { SewingRelationship, SewingValidationResult, SeamType } from '../types/sewing';
import { useGarmentStore } from './useGarmentStore';
import { calculateEdgeLength } from '../geometry/measurements';

interface SewingState {
  relationships: SewingRelationship[];
  selectedSeamId: string | null;

  setSelectedSeamId: (id: string | null) => void;
  setRelationships: (relationships: SewingRelationship[]) => void;
  addRelationship: (
    pieceAId: string,
    edgeAId: string,
    pieceBId: string,
    edgeBId: string,
    seamType?: SeamType
  ) => void;
  removeRelationship: (id: string) => void;
  toggleFlipped: (id: string) => void;
  toggleEnabled: (id: string) => void;
  validateRelationships: () => SewingValidationResult[];
}

export const useSewingStore = create<SewingState>((set, get) => ({
  relationships: useGarmentStore.getState().template.defaultSewing,
  selectedSeamId: null,

  setSelectedSeamId: (selectedSeamId) => set({ selectedSeamId }),

  setRelationships: (relationships) => set({ relationships }),

  addRelationship: (pieceAId, edgeAId, pieceBId, edgeBId, seamType = 'plain') => {
    const newId = `sew_${Date.now()}`;
    const newRel: SewingRelationship = {
      id: newId,
      name: `Seam ${pieceAId.replace('piece_', '')} <-> ${pieceBId.replace('piece_', '')}`,
      pieceAId,
      edgeAId,
      pieceBId,
      edgeBId,
      seamType,
      flipped: false,
      enabled: true,
    };
    set((state) => ({
      relationships: [...state.relationships, newRel],
      selectedSeamId: newId,
    }));
  },

  removeRelationship: (id) => {
    set((state) => ({
      relationships: state.relationships.filter((r) => r.id !== id),
      selectedSeamId: state.selectedSeamId === id ? null : state.selectedSeamId,
    }));
  },

  toggleFlipped: (id) => {
    set((state) => ({
      relationships: state.relationships.map((r) =>
        r.id === id ? { ...r, flipped: !r.flipped } : r
      ),
    }));
  },

  toggleEnabled: (id) => {
    set((state) => ({
      relationships: state.relationships.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  },

  validateRelationships: () => {
    const { relationships } = get();
    const pieces = useGarmentStore.getState().pieces;
    const results: SewingValidationResult[] = [];

    relationships.forEach((rel) => {
      const pieceA = pieces.find((p) => p.id === rel.pieceAId);
      const pieceB = pieces.find((p) => p.id === rel.pieceBId);

      if (!pieceA || !pieceB) return;

      const edgeA = pieceA.edges.find((e) => e.id === rel.edgeAId);
      const edgeB = pieceB.edges.find((e) => e.id === rel.edgeBId);

      if (!edgeA || !edgeB) return;

      const lenA = calculateEdgeLength(edgeA, pieceA.points);
      const lenB = calculateEdgeLength(edgeB, pieceB.points);
      const diff = Math.abs(lenA - lenB);
      const diffPct = (diff / Math.max(lenA, lenB, 1)) * 100;

      let status: SewingValidationResult['status'] = 'perfect';
      let message = 'Seam lengths match accurately.';

      if (diffPct > 15) {
        status = 'mismatch';
        message = `Severe length mismatch: ${(diff / 10).toFixed(1)}cm difference (${diffPct.toFixed(0)}%). Ease or adjust pattern edge.`;
      } else if (diffPct > 5) {
        status = 'warning';
        message = `Moderate length difference: ${(diff / 10).toFixed(1)}cm (${diffPct.toFixed(0)}%). Gathering or easing required.`;
      } else if (diffPct > 1) {
        status = 'acceptable';
        message = `Good match within normal garment tolerance (${(diff / 10).toFixed(1)}cm).`;
      }

      results.push({
        relationshipId: rel.id,
        lengthA: lenA,
        lengthB: lenB,
        difference: diff,
        differencePercentage: diffPct,
        status,
        message,
      });
    });

    return results;
  },
}));

