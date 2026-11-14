import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useSewingStore } from '../../store/useSewingStore';
import { formatUnit } from '../../geometry/converters';
import { calculatePieceArea } from '../../geometry/measurements';
import { ZoomIn, ZoomOut, RotateCcw, Link2, CheckCircle2 } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    cursorCoords,
    unit,
    activeTool,
    viewport,
    setViewport,
    resetViewport,
    selectedPieceId,
  } = useEditorStore();

  const { pieces } = useGarmentStore();
  const { relationships } = useSewingStore();

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  const toolHints: Record<string, string> = {
    select: 'Select Tool — Click point/edge to edit, or drag piece to move on cutting table',
    move: 'Move Tool — Drag entire pattern pieces across the 2D CAD canvas',
    bezier: 'Bézier Curve Tool — Drag tangent handles to adjust curvature of armholes and necklines',
    sew: 'Virtual Sewing — Click first seam edge, then click matching seam edge to stitch',
    'seam-allowance': 'Seam Allowance — Click piece to toggle cut seam allowance offset line',
    notch: 'Notch Tool — Click along edge to place balance notch marker for garment assembly',
    measure: 'Measurement Tool — Inspect point-to-point distance and curve arc length',
  };

  return (
    <footer className="h-7 border-t border-cad-border bg-cad-panel px-3 flex items-center justify-between text-[11px] text-cad-textDim select-none z-20">
      {/* LEFT: Cursor Coordinates & Tool Hint */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-cad-text">
          <span>X: <strong className="text-cad-accent">{formatUnit(cursorCoords.x, unit)}</strong></span>
          <span>Y: <strong className="text-cad-accent">{formatUnit(cursorCoords.y, unit)}</strong></span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-cad-textMuted border-l border-cad-border pl-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cad-accent inline-block" />
          <span>{toolHints[activeTool] || 'Active CAD Mode'}</span>
        </div>
      </div>

      {/* RIGHT: Selected Piece Info, Seam Counter, Zoom Controls */}
      <div className="flex items-center gap-4">
        {selectedPiece && (
          <div className="flex items-center gap-2 border-r border-cad-border pr-3">
            <span className="text-cad-text font-medium">{selectedPiece.name}</span>
            <span className="font-mono text-cad-accent">{calculatePieceArea(selectedPiece).toFixed(0)} cm²</span>
          </div>
        )}

        {/* Sewing Count */}
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{relationships.length} Seams OK</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 pl-2 border-l border-cad-border">
          <button
            onClick={() => setViewport({ zoom: Math.max(0.1, viewport.zoom - 0.1) })}
            className="p-1 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="w-12 text-center font-mono text-cad-text">
            {Math.round(viewport.zoom * 100)}%
          </span>

          <button
            onClick={() => setViewport({ zoom: Math.min(3.0, viewport.zoom + 0.1) })}
            className="p-1 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => useEditorStore.getState().triggerFitAll()}
            className="p-1 hover:text-cad-accent ml-1"
            title="Fit All Pattern Pieces (Fit to Screen)"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

