import React, { useState } from 'react';
import {
  FolderKanban,
  MousePointer2,
  Move,
  Spline,
  Scissors,
  Bookmark,
  Ruler,
  Layers,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Sliders,
  Tag,
  Sparkles,
  Link2,
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { GARMENT_TEMPLATES } from '../../garments/catalog';
import { CadTool } from '../../types/cad';
import { StandardSize } from '../../types/garment';
import { calculatePieceArea } from '../../geometry/measurements';
import { formatUnit } from '../../geometry/converters';
import { SliderInput } from '../common/SliderInput';

export const LeftSidebar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    selectedPieceId,
    setSelectedPieceId,
    unit,
    showSeamAllowance,
    setShowSeamAllowance,
    showGrainlines,
    setShowGrainlines,
    showNotches,
    setShowNotches,
    showDimensions,
    setShowDimensions,
  } = useEditorStore();

  const {
    template,
    setTemplate,
    activeSize,
    setActiveSize,
    measurements,
    setMeasurement,
    pieces,
    togglePieceSeamAllowance,
    setPieceSeamAllowanceWidth,
  } = useGarmentStore();

  const [activeTab, setActiveTab] = useState<'garment' | 'tools' | 'pieces' | 'measurements'>('garment');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tops' | 'bottoms'>('all');

  const filteredTemplates = GARMENT_TEMPLATES.filter(
    (t) => categoryFilter === 'all' || t.category === categoryFilter
  );

  const cadTools: { id: CadTool; name: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'select', name: 'Select & Pick', icon: <MousePointer2 className="w-4 h-4" />, shortcut: 'V' },
    { id: 'move', name: 'Move Pattern Piece', icon: <Move className="w-4 h-4" />, shortcut: 'M' },
    { id: 'bezier', name: 'Bézier Curve Edit', icon: <Spline className="w-4 h-4" />, shortcut: 'C' },
    { id: 'sew', name: 'Virtual Sewing Stitch', icon: <Link2 className="w-4 h-4" />, shortcut: 'W' },
    { id: 'seam-allowance', name: 'Seam Allowance', icon: <Scissors className="w-4 h-4" />, shortcut: 'S' },
    { id: 'notch', name: 'Add Notch Marker', icon: <Bookmark className="w-4 h-4" />, shortcut: 'N' },
    { id: 'measure', name: 'Tape Measure', icon: <Ruler className="w-4 h-4" />, shortcut: 'Q' },
  ];

  const sizes: StandardSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <aside className="w-80 h-full bg-cad-panel border-r border-cad-border flex flex-col select-none overflow-hidden text-cad-text z-10">
      {/* Navigation Tabs Header */}
      <div className="grid grid-cols-4 border-b border-cad-border bg-cad-bg/50 p-1 text-[11px] font-medium text-center">
        <button
          onClick={() => setActiveTab('garment')}
          className={`py-1.5 rounded transition ${
            activeTab === 'garment'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`py-1.5 rounded transition ${
            activeTab === 'tools'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          CAD Tools
        </button>
        <button
          onClick={() => setActiveTab('pieces')}
          className={`py-1.5 rounded transition ${
            activeTab === 'pieces'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          Pieces
        </button>
        <button
          onClick={() => setActiveTab('measurements')}
          className={`py-1.5 rounded transition ${
            activeTab === 'measurements'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          Specs
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ========================================================= */}
        {/* TAB 1: GARMENT CATALOG */}
        {/* ========================================================= */}
        {activeTab === 'garment' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">Garment Library</span>
              <div className="flex bg-cad-bg rounded p-0.5 border border-cad-border text-[10px]">
                {(['all', 'tops', 'bottoms'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded capitalize ${
                      categoryFilter === cat ? 'bg-cad-panelLight text-cad-accent font-bold' : 'text-cad-textDim'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredTemplates.map((item) => {
                const isSelected = template.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setTemplate(item.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-cad-accent bg-cad-accentSoft/30 shadow-md shadow-emerald-950/20'
                        : 'border-cad-border bg-cad-panelLight/40 hover:border-cad-borderLight hover:bg-cad-panelLight'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-cad-accent' : 'text-cad-text'}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cad-bg border border-cad-border text-cad-textDim">
                        {item.fit}
                      </span>
                    </div>
                    <p className="text-[11px] text-cad-textMuted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-cad-border/50 text-[10px] text-cad-textDim">
                      <span>Category: <strong className="text-cad-text">{item.subcategory}</strong></span>
                      <span>Pieces: <strong className="text-cad-text">{item.generatePatterns({}).length}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CAD TOOLS */}
        {/* ========================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Pattern Tools
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {cadTools.map((tool) => {
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition border ${
                        isActive
                          ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold shadow-sm'
                          : 'border-transparent bg-cad-panelLight/50 text-cad-text hover:bg-cad-panelLight hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-cad-accent' : 'text-cad-textMuted'}>{tool.icon}</span>
                        <span>{tool.name}</span>
                      </div>
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cad-bg border border-cad-border text-cad-textDim">
                        {tool.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display / Layer Overlays */}
            <div className="pt-3 border-t border-cad-border">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                CAD View Overlays
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Seam Allowance Lines</span>
                  <input
                    type="checkbox"
                    checked={showSeamAllowance}
                    onChange={(e) => setShowSeamAllowance(e.target.checked)}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Grainlines & Direction</span>
                  <input
                    type="checkbox"
                    checked={showGrainlines}
                    onChange={(e) => setShowGrainlines(e.target.checked)}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Notches & Drill Holes</span>
                  <input
                    type="checkbox"
                    checked={showNotches}
                    onChange={(e) => setShowNotches(e.target.checked)}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Edge Dimension Badges</span>
                  <input
                    type="checkbox"
                    checked={showDimensions}
                    onChange={(e) => setShowDimensions(e.target.checked)}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PATTERN PIECES */}
        {/* ========================================================= */}
        {activeTab === 'pieces' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
                Pattern Pieces ({pieces.length})
              </span>
            </div>

            <div className="space-y-2">
              {pieces.map((piece) => {
                const isSelected = selectedPieceId === piece.id;
                const area = calculatePieceArea(piece);

                return (
                  <div
                    key={piece.id}
                    onClick={() => setSelectedPieceId(piece.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'border-cad-accent bg-cad-accentSoft/30 shadow-sm'
                        : 'border-cad-border bg-cad-panelLight/40 hover:border-cad-borderLight'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: piece.color || '#10b981' }}
                        />
                        <span className={`text-xs font-semibold ${isSelected ? 'text-cad-accent' : 'text-cad-text'}`}>
                          {piece.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cad-bg border border-cad-border text-cad-textDim">
                        Cut {piece.cutQuantity}x
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-cad-textMuted mb-2">
                      <div>Area: <strong className="text-cad-text font-mono">{area.toFixed(0)} cm²</strong></div>
                      <div>Edges: <strong className="text-cad-text font-mono">{piece.edges.length}</strong></div>
                    </div>

                    {/* Seam Allowance controls for selected piece */}
                    {isSelected && (
                      <div className="pt-2 border-t border-cad-border/60 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-cad-textMuted">Seam Allowance:</span>
                          <button
                            onClick={() => togglePieceSeamAllowance(piece.id)}
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                              piece.seamAllowanceEnabled
                                ? 'bg-cad-accent text-black'
                                : 'bg-cad-bg text-cad-textDim border border-cad-border'
                            }`}
                          >
                            {piece.seamAllowanceEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                        {piece.seamAllowanceEnabled && (
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={5}
                              max={30}
                              step={1}
                              value={piece.defaultSeamAllowance}
                              onChange={(e) =>
                                setPieceSeamAllowanceWidth(piece.id, parseFloat(e.target.value))
                              }
                              className="flex-1 h-1 bg-cad-bg rounded-lg appearance-none cursor-pointer accent-cad-accent"
                            />
                            <span className="text-[11px] font-mono text-cad-accent w-10 text-right">
                              {piece.defaultSeamAllowance}mm
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MEASUREMENTS & GRADING */}
        {/* ========================================================= */}
        {activeTab === 'measurements' && (
          <div className="space-y-4">
            {/* Size Grading Selector */}
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Graded Size
              </span>
              <div className="grid grid-cols-6 gap-1 bg-cad-bg p-1 rounded border border-cad-border">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`py-1 rounded text-xs font-mono font-semibold transition ${
                      activeSize === s
                        ? 'bg-cad-accent text-black shadow-sm'
                        : 'text-cad-textMuted hover:text-white hover:bg-cad-panelLight'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Parametric Measurements Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
                  Parametric Dimensions
                </span>
                <span className="text-[10px] text-cad-accent font-mono">Live Sync 2D/3D</span>
              </div>

              <div className="space-y-2 bg-cad-panelLight/30 p-2.5 rounded-lg border border-cad-border">
                {template.measurements.map((spec) => {
                  const currentValue = measurements[spec.id] ?? spec.value;
                  return (
                    <SliderInput
                      key={spec.id}
                      label={spec.name}
                      description={spec.description}
                      value={currentValue}
                      min={spec.min}
                      max={spec.max}
                      step={spec.step}
                      unit="mm"
                      onChange={(newVal) => setMeasurement(spec.id, newVal)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
