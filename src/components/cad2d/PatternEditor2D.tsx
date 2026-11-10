import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useSewingStore } from '../../store/useSewingStore';
import { useDesignStore } from '../../store/useDesignStore';
import { Point2D, PatternPiece, ControlPoint, Edge2D } from '../../types/cad';
import { ArtworkLayer } from '../../types/artwork';
import { generateSeamAllowanceContour, contourToSvgPath } from '../../geometry/offset';
import { sampleEdgePoints, calculateEdgeLength, getPointOnEdgeAtRatio, getPieceBoundingBox } from '../../geometry/measurements';
import { formatUnit } from '../../geometry/converters';
import { Rulers } from './Rulers';

export const PatternEditor2D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const {
    viewport,
    setViewport,
    activeTool,
    selectedPieceId,
    setSelectedPieceId,
    selectedPointId,
    setSelectedPointId,
    selectedEdgeId,
    setSelectedEdgeId,
    unit,
    gridSnap,
    gridSize,
    showSeamAllowance,
    showGrainlines,
    showNotches,
    showDimensions,
    setCursorCoords,
    pendingSewEdge,
    setPendingSewEdge,
  } = useEditorStore();

  const {
    pieces,
    updatePiecePosition,
    updatePiecePoint,
    updateEdgeControlPoint,
    rotatePiece,
    addNotchToEdge,
    addPointToEdge,
  } = useGarmentStore();

  const { relationships, addRelationship } = useSewingStore();
  const { layers, activeLayerId, setActiveLayerId, updateLayer } = useDesignStore();

  // Dragging interaction state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point2D>({ x: 0, y: 0 });

  // Piece dragging
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [pieceDragOffset, setPieceDragOffset] = useState<Point2D>({ x: 0, y: 0 });

  // Point dragging
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);

  // Control handle dragging (Bézier)
  const [draggingCp, setDraggingCp] = useState<{ pieceId: string; edgeId: string; cpIndex: number } | null>(null);

  // Artwork dragging & transforming
  const [draggingArtworkId, setDraggingArtworkId] = useState<string | null>(null);
  const [artworkDragOffset, setArtworkDragOffset] = useState<Point2D>({ x: 0, y: 0 });
  const [resizingArtwork, setResizingArtwork] = useState<{
    id: string;
    corner: string;
    startWidth: number;
    initialDist: number;
    center: Point2D;
  } | null>(null);
  const [rotatingArtwork, setRotatingArtwork] = useState<{ id: string; center: Point2D; startAngle: number; initialRotation: number } | null>(null);

  // Tape measure live line
  const [measureStart, setMeasureStart] = useState<Point2D | null>(null);
  const [measureCurrent, setMeasureCurrent] = useState<Point2D | null>(null);

  // Convert screen coordinates to world canvas coordinates (mm)
  const screenToWorld = (screenX: number, screenY: number): Point2D => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (screenX - rect.left - viewport.x) / viewport.zoom;
    const y = (screenY - rect.top - viewport.y) / viewport.zoom;
    return { x, y };
  };

  const snapValue = (val: number): number => {
    if (!gridSnap) return val;
    return Math.round(val / gridSize) * gridSize;
  };

  // Helper to compute piece artwork center anchor
  const getPieceAnchor = (piece: PatternPiece): Point2D => {
    const bbox = getPieceBoundingBox(piece);
    const centerX = bbox.minX + bbox.width / 2;
    // For front and back body, place default chest/yoke anchor higher up
    let centerY = bbox.minY + bbox.height / 2;
    if (piece.category === 'body') {
      centerY = bbox.minY + bbox.height * 0.38;
    }
    return { x: centerX, y: centerY };
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newZoom = Math.min(3.5, Math.max(0.15, viewport.zoom * zoomFactor));

    const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
    const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);

    setViewport({ x: newX, y: newY, zoom: newZoom });
  };

  // Background MouseDown
  const handleMouseDown = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);

    // Measure tool
    if (activeTool === 'measure') {
      setMeasureStart(worldPos);
      setMeasureCurrent(worldPos);
      return;
    }

    // Middle click or clicking empty workspace background
    if (e.button === 1 || (e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'rect') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      // Deselect artwork if clicking empty space
      setActiveLayerId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    setCursorCoords({
      x: Math.round(worldPos.x),
      y: Math.round(worldPos.y),
    });

    if (activeTool === 'measure' && measureStart) {
      setMeasureCurrent(worldPos);
      return;
    }

    if (isPanning) {
      setViewport({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // 1. Resizing Artwork (Proportional radial resize from center)
    if (resizingArtwork) {
      const currentDist = Math.hypot(worldPos.x - resizingArtwork.center.x, worldPos.y - resizingArtwork.center.y);
      const scaleFactor = currentDist / resizingArtwork.initialDist;
      const newWidth = Math.max(30, Math.round(resizingArtwork.startWidth * scaleFactor));
      updateLayer(resizingArtwork.id, { width: newWidth });
      return;
    }

    // 2. Rotating Artwork
    if (rotatingArtwork) {
      const dx = worldPos.x - rotatingArtwork.center.x;
      const dy = worldPos.y - rotatingArtwork.center.y;
      const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      const angleDelta = currentAngle - rotatingArtwork.startAngle;
      const newRotation = Math.round((rotatingArtwork.initialRotation + angleDelta) % 360);
      updateLayer(rotatingArtwork.id, { rotation: newRotation });
      return;
    }

    // 3. Dragging Artwork
    if (draggingArtworkId) {
      const activeLayer = layers.find((l) => l.id === draggingArtworkId);
      const targetPiece = pieces.find((p) => p.id === activeLayer?.pieceId) || pieces[0];
      if (targetPiece) {
        const anchor = getPieceAnchor(targetPiece);
        const localX = snapValue(worldPos.x - (targetPiece.position.x + anchor.x) - artworkDragOffset.x);
        const localY = snapValue(worldPos.y - (targetPiece.position.y + anchor.y) - artworkDragOffset.y);
        updateLayer(draggingArtworkId, { x: localX, y: localY });
      }
      return;
    }

    // 4. Dragging Pattern Piece
    if (draggingPieceId) {
      const newX = snapValue(worldPos.x - pieceDragOffset.x);
      const newY = snapValue(worldPos.y - pieceDragOffset.y);
      updatePiecePosition(draggingPieceId, newX, newY);
      return;
    }

    // 5. Dragging Bézier Control Point
    if (draggingCp) {
      const piece = pieces.find((p) => p.id === draggingCp.pieceId);
      if (piece) {
        const localX = snapValue(worldPos.x - piece.position.x);
        const localY = snapValue(worldPos.y - piece.position.y);
        updateEdgeControlPoint(draggingCp.pieceId, draggingCp.edgeId, draggingCp.cpIndex, { x: localX, y: localY });
      }
      return;
    }

    // 6. Dragging Pattern Point / Vertex
    if (draggingPointId && selectedPieceId) {
      const piece = pieces.find((p) => p.id === selectedPieceId);
      if (piece) {
        const localX = snapValue(worldPos.x - piece.position.x);
        const localY = snapValue(worldPos.y - piece.position.y);
        updatePiecePoint(selectedPieceId, draggingPointId, { x: localX, y: localY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingPieceId(null);
    setDraggingPointId(null);
    setDraggingCp(null);
    setDraggingArtworkId(null);
    setResizingArtwork(null);
    setRotatingArtwork(null);
    setMeasureStart(null);
    setMeasureCurrent(null);
  };

  // Edge click handler
  const handleEdgeClick = (e: React.MouseEvent, pieceId: string, edgeId: string) => {
    e.stopPropagation();
    setSelectedPieceId(pieceId);
    setSelectedEdgeId(edgeId);

    if (activeTool === 'sew') {
      if (!pendingSewEdge) {
        setPendingSewEdge({ pieceId, edgeId });
      } else {
        if (pendingSewEdge.pieceId !== pieceId || pendingSewEdge.edgeId !== edgeId) {
          addRelationship(pendingSewEdge.pieceId, pendingSewEdge.edgeId, pieceId, edgeId);
        }
        setPendingSewEdge(null);
      }
    } else if (activeTool === 'notch') {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      addNotchToEdge(pieceId, edgeId, 0.5);
    }
  };

  // Start dragging a piece
  const handlePieceMouseDown = (e: React.MouseEvent, piece: PatternPiece) => {
    if (activeTool === 'sew') return;
    e.stopPropagation();
    setSelectedPieceId(piece.id);

    if (activeTool === 'move' || activeTool === 'select') {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      setDraggingPieceId(piece.id);
      setPieceDragOffset({
        x: worldPos.x - piece.position.x,
        y: worldPos.y - piece.position.y,
      });
    }
  };

  // Start dragging a vertex
  const handlePointMouseDown = (e: React.MouseEvent, pieceId: string, pointId: string) => {
    e.stopPropagation();
    setSelectedPieceId(pieceId);
    setSelectedPointId(pointId);
    setDraggingPointId(pointId);
  };

  // Start dragging artwork directly on pattern piece
  const handleArtworkMouseDown = (e: React.MouseEvent, layer: ArtworkLayer, piece: PatternPiece) => {
    e.stopPropagation();
    setSelectedPieceId(piece.id);
    setActiveLayerId(layer.id);

    if (layer.locked) return;

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const anchor = getPieceAnchor(piece);
    const artworkWorldX = piece.position.x + anchor.x + layer.x;
    const artworkWorldY = piece.position.y + anchor.y + layer.y;

    setDraggingArtworkId(layer.id);
    setArtworkDragOffset({
      x: worldPos.x - artworkWorldX,
      y: worldPos.y - artworkWorldY,
    });
  };

  // Start resizing artwork
  const handleResizeHandleDown = (e: React.MouseEvent, layer: ArtworkLayer, piece: PatternPiece, corner: string) => {
    e.stopPropagation();
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const anchor = getPieceAnchor(piece);
    const center = {
      x: piece.position.x + anchor.x + layer.x,
      y: piece.position.y + anchor.y + layer.y,
    };
    const initialDist = Math.hypot(worldPos.x - center.x, worldPos.y - center.y) || 1;
    setResizingArtwork({
      id: layer.id,
      corner,
      startWidth: layer.width || 200,
      initialDist,
      center,
    });
  };

  // Start rotating artwork
  const handleRotateHandleDown = (e: React.MouseEvent, layer: ArtworkLayer, piece: PatternPiece) => {
    e.stopPropagation();
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const anchor = getPieceAnchor(piece);
    const center = {
      x: piece.position.x + anchor.x + layer.x,
      y: piece.position.y + anchor.y + layer.y,
    };
    const dx = worldPos.x - center.x;
    const dy = worldPos.y - center.y;
    const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    setRotatingArtwork({
      id: layer.id,
      center,
      startAngle,
      initialRotation: layer.rotation,
    });
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative flex-1 h-full w-full bg-cad-bg overflow-hidden cursor-crosshair select-none"
    >
      {/* 2D SVG CAD Canvas */}
      <svg
        className="w-full h-full block"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Subtle CAD Grid Pattern */}
          <pattern id="grid-pattern-small" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1e28" strokeWidth="0.8" />
          </pattern>
          <pattern id="grid-pattern-large" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#grid-pattern-small)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#252b3a" strokeWidth="1.2" />
          </pattern>

          {/* Grainline Arrow Markers */}
          <marker
            id="grain-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* CAD Grid Background */}
        <rect
          x="-5000"
          y="-5000"
          width="10000"
          height="10000"
          fill="url(#grid-pattern-large)"
        />

        {/* Coordinate Origin Crosshair (0,0) */}
        <g stroke="#334155" strokeWidth="1.5">
          <line x1="-80" y1="0" x2="80" y2="0" />
          <line x1="0" y1="-80" x2="0" y2="80" />
          <circle cx="0" cy="0" r="3.5" fill="#10b981" />
        </g>

        {/* Visual Sewing Seam Link Curves */}
        {relationships.map((rel) => {
          const pieceA = pieces.find((p) => p.id === rel.pieceAId);
          const pieceB = pieces.find((p) => p.id === rel.pieceBId);
          if (!pieceA || !pieceB) return null;

          const edgeA = pieceA.edges.find((e) => e.id === rel.edgeAId);
          const edgeB = pieceB.edges.find((e) => e.id === rel.edgeBId);
          if (!edgeA || !edgeB) return null;

          const ptA = getPointOnEdgeAtRatio(edgeA, pieceA.points, 0.5);
          const ptB = getPointOnEdgeAtRatio(edgeB, pieceB.points, 0.5);
          if (!ptA || !ptB) return null;

          const worldA = { x: pieceA.position.x + ptA.x, y: pieceA.position.y + ptA.y };
          const worldB = { x: pieceB.position.x + ptB.x, y: pieceB.position.y + ptB.y };
          const midX = (worldA.x + worldB.x) / 2;
          const midY = (worldA.y + worldB.y) / 2 - 40;

          return (
            <g key={rel.id} className="pointer-events-none opacity-80">
              <path
                d={`M ${worldA.x} ${worldA.y} Q ${midX} ${midY} ${worldB.x} ${worldB.y}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeDasharray="6,4"
              />
              <circle cx={worldA.x} cy={worldA.y} r="4" fill="#10b981" />
              <circle cx={worldB.x} cy={worldB.y} r="4" fill="#10b981" />
            </g>
          );
        })}

        {/* Pattern Pieces */}
        {pieces.map((piece) => {
          const isSelected = selectedPieceId === piece.id;
          const bbox = getPieceBoundingBox(piece);
          const anchor = getPieceAnchor(piece);

          // Build SVG path for inner sewing boundary
          let sewPath = '';
          piece.edges.forEach((edge, idx) => {
            const pts = sampleEdgePoints(edge, piece.points, 20);
            if (pts.length > 0) {
              if (idx === 0) {
                sewPath += `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
              }
              for (let i = 1; i < pts.length; i++) {
                sewPath += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
              }
            }
          });
          sewPath += ' Z';

          // Outer cut contour with seam allowance
          const saPoints = piece.seamAllowanceEnabled ? generateSeamAllowanceContour(piece) : [];
          const saPath = saPoints.length > 0 ? contourToSvgPath(saPoints) : '';

          // Filter artwork layers placed on this specific piece
          const pieceLayers = layers.filter((l) => {
            if (l.pieceId) return l.pieceId === piece.id;
            // Fallback for default front body
            return piece.id.includes('front');
          });

          return (
            <g
              key={piece.id}
              transform={`translate(${piece.position.x}, ${piece.position.y}) rotate(${piece.rotation})`}
              onMouseDown={(e) => handlePieceMouseDown(e, piece)}
              className="cursor-move group"
            >
              {/* Outer Seam Allowance / Cut Line */}
              {showSeamAllowance && saPath && (
                <path
                  d={saPath}
                  fill="none"
                  stroke={isSelected ? '#60a5fa' : '#64748b'}
                  strokeWidth="1.5"
                  strokeDasharray="5,4"
                />
              )}

              {/* Inner Pattern Piece Body & Fill */}
              <path
                d={sewPath}
                fill={isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(30, 41, 59, 0.45)'}
                stroke={isSelected ? '#10b981' : '#475569'}
                strokeWidth={isSelected ? '2.5' : '1.8'}
                className="transition duration-100 hover:fill-emerald-950/20"
              />

              {/* Clickable Edge Boundaries */}
              {piece.edges.map((edge) => {
                const pts = sampleEdgePoints(edge, piece.points, 16);
                let edgeD = '';
                if (pts.length > 0) {
                  edgeD = `M ${pts[0].x} ${pts[0].y}`;
                  for (let i = 1; i < pts.length; i++) {
                    edgeD += ` L ${pts[i].x} ${pts[i].y}`;
                  }
                }
                const isEdgeSelected = selectedEdgeId === edge.id;
                const isPendingSew = pendingSewEdge?.edgeId === edge.id;
                const len = calculateEdgeLength(edge, piece.points);
                const midPt = getPointOnEdgeAtRatio(edge, piece.points, 0.5);

                return (
                  <g key={edge.id}>
                    {/* Thick invisible click area */}
                    <path
                      d={edgeD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="16"
                      className="cursor-pointer"
                      onClick={(e) => handleEdgeClick(e, piece.id, edge.id)}
                    />

                    {/* Edge highlight stroke */}
                    {(isEdgeSelected || isPendingSew) && (
                      <path
                        d={edgeD}
                        fill="none"
                        stroke={isPendingSew ? '#f59e0b' : '#38bdf8'}
                        strokeWidth="3.5"
                        strokeDasharray={isPendingSew ? '4,4' : undefined}
                      />
                    )}

                    {/* Dimension Badge */}
                    {showDimensions && midPt && (
                      <g
                        transform={`translate(${midPt.x}, ${midPt.y})`}
                        className="pointer-events-none"
                      >
                        <rect
                          x="-24"
                          y="-9"
                          width="48"
                          height="18"
                          rx="4"
                          fill="#181c24"
                          stroke="#2a3242"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {formatUnit(len, unit)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Grainline */}
              {showGrainlines && piece.grainline && (
                <g className="pointer-events-none">
                  <line
                    x1={piece.grainline.start.x}
                    y1={piece.grainline.start.y}
                    x2={piece.grainline.end.x}
                    y2={piece.grainline.end.y}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    markerStart="url(#grain-arrow)"
                    markerEnd="url(#grain-arrow)"
                  />
                  <text
                    x={(piece.grainline.start.x + piece.grainline.end.x) / 2 + 10}
                    y={(piece.grainline.start.y + piece.grainline.end.y) / 2}
                    fill="#38bdf8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    GRAIN
                  </text>
                </g>
              )}

              {/* Notches */}
              {showNotches &&
                piece.notches.map((notch) => {
                  const edge = piece.edges.find((e) => e.id === notch.edgeId);
                  if (!edge) return null;
                  const pt = getPointOnEdgeAtRatio(edge, piece.points, notch.distanceRatio);
                  if (!pt) return null;

                  return (
                    <g key={notch.id} transform={`translate(${pt.x}, ${pt.y})`} className="pointer-events-none">
                      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ef4444" strokeWidth="2" />
                      <line x1="-4" y1="4" x2="4" y2="-4" stroke="#ef4444" strokeWidth="2" />
                    </g>
                  );
                })}

              {/* Internal Placement Lines */}
              {piece.internalLines.map((il) => {
                if (il.points.length < 2) return null;
                const d = `M ${il.points[0].x} ${il.points[0].y} L ${il.points[1].x} ${il.points[1].y}`;
                return (
                  <path
                    key={il.id}
                    d={d}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                    className="pointer-events-none"
                  />
                );
              })}

              {/* Center Piece Metadata Title */}
              <g
                transform={`translate(${bbox.minX + bbox.width / 2}, ${bbox.minY + bbox.height / 2})`}
                className="pointer-events-none"
              >
                <text
                  x="0"
                  y="-10"
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {piece.name}
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  Cut {piece.cutQuantity}x • SA: {piece.defaultSeamAllowance}mm
                </text>
              </g>

              {/* INTERACTIVE ARTWORK LAYERS PLACED DIRECTLY ON THIS PIECE */}
              <g transform={`translate(${anchor.x}, ${anchor.y})`}>
                {pieceLayers.map((layer) => {
                  if (!layer.visible) return null;
                  const isLayerSelected = activeLayerId === layer.id;
                  const w = layer.width || 200;
                  const h = layer.height || 60;

                  return (
                    <g
                      key={layer.id}
                      transform={`translate(${layer.x}, ${layer.y}) rotate(${layer.rotation}) scale(${layer.scale * (layer.flipH ? -1 : 1)}, ${layer.scale * (layer.flipV ? -1 : 1)})`}
                      onMouseDown={(e) => handleArtworkMouseDown(e, layer, piece)}
                      className="cursor-move"
                      style={{ opacity: layer.opacity }}
                    >
                      {/* 1. Text Layer */}
                      {layer.type === 'text' ? (
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={layer.textColor || '#ffffff'}
                          fontFamily={layer.fontFamily || 'Inter'}
                          fontSize={layer.fontSize || 36}
                          letterSpacing={layer.letterSpacing || 2}
                          fontWeight="bold"
                          className="select-none"
                        >
                          {layer.text}
                        </text>
                      ) : layer.imageUrl ? (
                        /* 2. Image Graphic Layer */
                        <image
                          href={layer.imageUrl}
                          x={-w / 2}
                          y={-h / 2}
                          width={w}
                          height={h}
                          preserveAspectRatio="xMidYMid meet"
                        />
                      ) : null}

                      {/* Transform Bounding Box & Handles for Selected Artwork */}
                      {isLayerSelected && (
                        <g className="cursor-default">
                          <rect
                            x={-w / 2 - 6}
                            y={-h / 2 - 6}
                            width={w + 12}
                            height={h + 12}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                          />

                          {/* 4 Corner Resize Handles */}
                          {['tl', 'tr', 'br', 'bl'].map((corner) => {
                            const cx = corner.includes('r') ? w / 2 + 6 : -w / 2 - 6;
                            const cy = corner.includes('b') ? h / 2 + 6 : -h / 2 - 6;
                            return (
                              <rect
                                key={corner}
                                x={cx - 4}
                                y={cy - 4}
                                width="8"
                                height="8"
                                fill="#ffffff"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                className="cursor-nwse-resize"
                                onMouseDown={(e) => handleResizeHandleDown(e, layer, piece, corner)}
                              />
                            );
                          })}

                          {/* Rotation Pin Top Handle */}
                          <line x1="0" y1={-h / 2 - 6} x2="0" y2={-h / 2 - 24} stroke="#10b981" strokeWidth="1.5" />
                          <circle
                            cx="0"
                            cy={-h / 2 - 24}
                            r="5"
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="cursor-grab hover:scale-125"
                            onMouseDown={(e) => handleRotateHandleDown(e, layer, piece)}
                          />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Interactive Control Points / Vertices */}
              {isSelected &&
                piece.points.map((pt) => {
                  const isPtSelected = selectedPointId === pt.id;
                  return (
                    <circle
                      key={pt.id}
                      cx={pt.x}
                      cy={pt.y}
                      r={isPtSelected ? 6.5 : 4.5}
                      fill={isPtSelected ? '#38bdf8' : '#10b981'}
                      stroke="#0f1115"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onMouseDown={(e) => handlePointMouseDown(e, piece.id, pt.id)}
                    />
                  );
                })}

              {/* Bézier Curve Control Handles (when bezier tool is active or point selected) */}
              {isSelected &&
                piece.edges.map((edge) => {
                  if (edge.type !== 'cubic-bezier' || !edge.controlPoints) return null;
                  return edge.controlPoints.map((cp, idx) => (
                    <g key={`${edge.id}_cp_${idx}`}>
                      <circle
                        cx={cp.x}
                        cy={cp.y}
                        r="4"
                        fill="#f59e0b"
                        stroke="#0f1115"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:scale-125"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDraggingCp({ pieceId: piece.id, edgeId: edge.id, cpIndex: idx });
                        }}
                      />
                    </g>
                  ));
                })}
            </g>
          );
        })}

        {/* Live Tape Measure Line */}
        {measureStart && measureCurrent && (
          <g className="pointer-events-none">
            <line
              x1={measureStart.x}
              y1={measureStart.y}
              x2={measureCurrent.x}
              y2={measureCurrent.y}
              stroke="#ec4899"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <circle cx={measureStart.x} cy={measureStart.y} r="4" fill="#ec4899" />
            <circle cx={measureCurrent.x} cy={measureCurrent.y} r="4" fill="#ec4899" />
            <g transform={`translate(${(measureStart.x + measureCurrent.x) / 2}, ${(measureStart.y + measureCurrent.y) / 2 - 14})`}>
              <rect x="-35" y="-10" width="70" height="20" rx="4" fill="#181c24" stroke="#ec4899" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill="#ec4899" fontSize="10" fontFamily="monospace" fontWeight="bold">
                {formatUnit(Math.hypot(measureCurrent.x - measureStart.x, measureCurrent.y - measureStart.y), unit)}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* On-Canvas Metric Rulers (Top & Left) */}
      <Rulers
        width={containerSize.width}
        height={containerSize.height}
        viewport={viewport}
        cursorCoords={useEditorStore.getState().cursorCoords}
        unit={unit}
      />
    </div>
  );
};
