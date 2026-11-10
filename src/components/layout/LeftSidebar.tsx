import React, { useState } from 'react';
import {
  Search,
  MousePointer2,
  Move,
  Spline,
  Scissors,
  Bookmark,
  Ruler,
  Layers,
  RotateCw,
  RotateCcw,
  Sparkles,
  Link2,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  LayoutGrid,
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { GARMENT_TEMPLATES } from '../../garments/catalog';
import { CadTool } from '../../types/cad';
import { StandardSize, GarmentCategory } from '../../types/garment';
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
    rotatePiece,
    duplicatePiece,
    deletePiece,
    resetPatternLayout,
  } = useGarmentStore();

  const [activeTab, setActiveTab] = useState<'garment' | 'tools' | 'pieces' | 'measurements'>('garment');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tops' | 'hoodies' | 'outerwear' | 'tanks' | 'bottoms' | 'shorts'>('all');

  // Filter 132+ garment catalog
  const filteredTemplates = GARMENT_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'tops') return t.subcategory.includes('T-Shirt') || t.subcategory.includes('Polo');
    if (categoryFilter === 'hoodies') return t.subcategory.includes('Hoodie') || t.name.includes('Sweatshirt');
    if (categoryFilter === 'outerwear') return t.name.includes('Jacket') || t.name.includes('Coat');
    if (categoryFilter === 'tanks') return t.name.includes('Tank');
    if (categoryFilter === 'bottoms') return t.category === 'bottoms' && !t.name.includes('Short');
    if (categoryFilter === 'shorts') return t.name.includes('Short');

    return true;
  });

  const cadTools: { id: CadTool; name: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'select', name: 'Select & Pick', icon: <MousePointer2 className="w-4 h-4" />, shortcut: 'V' },
    { id: 'move', name: 'Move Pattern Piece', icon: <Move className="w-4 h-4" />, shortcut: 'M' },
    { id: 'bezier', name: 'Bézier Curve Edit', icon: <Spline className="w-4 h-4" />, shortcut: 'C' },
    { id: 'sew', name: 'Virtual Sewing Seam', icon: <Link2 className="w-4 h-4" />, shortcut: 'W' },
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
        {/* TAB 1: GARMENT CATALOG (132+ GARMENTS) */}
        {/* ========================================================= */}
        {activeTab === 'garment' && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cad-textDim absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 132+ garment styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cad-bg border border-cad-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-cad-text placeholder-cad-textDim focus:outline-none focus:border-cad-accent transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[10px]">
              {(['all', 'tops', 'hoodies', 'outerwear', 'tanks', 'bottoms', 'shorts'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded capitalize transition ${
                    categoryFilter === cat
                      ? 'bg-cad-accent text-black font-bold shadow-sm'
                      : 'bg-cad-panelLight/60 text-cad-textMuted hover:text-white border border-cad-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-cad-textDim flex items-center justify-between px-1">
              <span>Showing {filteredTemplates.length} styles</span>
              <span className="text-cad-accent font-mono">132 Styles Total</span>
            </div>

            {/* Garment Cards */}
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredTemplates.map((item) => {
                const isSelected = template.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setTemplate(item.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-cad-accent bg-cad-accentSoft/30 shadow-md shadow-emerald-950/20 ring-1 ring-cad-accent/40'
                        : 'border-cad-border bg-cad-panelLight/40 hover:border-cad-borderLight hover:bg-cad-panelLight'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-cad-accent' : 'text-cad-text'}`}>
                        {item.name}
                      </span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cad-bg border border-cad-border text-cad-textDim">
                        {item.fit}
                      </span>
                    </div>

                    <p className="text-[11px] text-cad-textMuted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-cad-border/50 text-[10px] text-cad-textDim">
                      <span>Cat: <strong className="text-cad-text">{item.subcategory}</strong></span>
                      <span>Cut Panels: <strong className="text-cad-accent font-mono">{item.generatePatterns({}).length}</strong></span>
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
                  Pattern Tools
                </span>
                <button
                  onClick={resetPatternLayout}
                  className="text-[10px] text-cad-accent hover:underline flex items-center gap-1"
                  title="Restore default 2D layout"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Reset Layout</span>
                </button>
              </div>

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

            {/* CAD View Overlays */}
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
                  <span className="text-cad-textMuted">Notches & Marks</span>
                  <input
                    type="checkbox"
                    checked={showNotches}
                    onChange={(e) => setShowNotches(e.target.checked)}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Edge Dimensions (mm)</span>
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
        {/* TAB 3: PATTERN PIECES & INSPECTOR */}
        {/* ========================================================= */}
        {activeTab === 'pieces' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
                Pattern Pieces ({pieces.length})
              </span>
              <button
                onClick={resetPatternLayout}
                className="text-[10px] text-cad-accent hover:underline"
              >
                Reset Positions
              </button>
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
                        ? 'border-cad-accent bg-cad-accentSoft/30 shadow-sm ring-1 ring-cad-accent/40'
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
                      <div>Vertices: <strong className="text-cad-text font-mono">{piece.points.length}</strong></div>
                    </div>

                    {/* Actions for selected piece */}
                    {isSelected && (
                      <div className="pt-2 border-t border-cad-border/60 space-y-2" onClick={(e) => e.stopPropagation()}>
                        {/* Position & Rotation Stats */}
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-cad-textDim">
                          <div>X: {Math.round(piece.position.x)} mm</div>
                          <div>Y: {Math.round(piece.position.y)} mm</div>
                        </div>

                        {/* Rotation & Duplicate buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => rotatePiece(piece.id, -90)}
                            className="flex-1 py-1 px-1.5 bg-cad-bg border border-cad-border hover:border-cad-accent rounded text-[10px] flex items-center justify-center gap-1 text-cad-textMuted hover:text-white"
                            title="Rotate -90°"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>-90°</span>
                          </button>
                          <button
                            onClick={() => rotatePiece(piece.id, 90)}
                            className="flex-1 py-1 px-1.5 bg-cad-bg border border-cad-border hover:border-cad-accent rounded text-[10px] flex items-center justify-center gap-1 text-cad-textMuted hover:text-white"
                            title="Rotate +90°"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>+90°</span>
                          </button>
                          <button
                            onClick={() => duplicatePiece(piece.id)}
                            className="p-1.5 bg-cad-bg border border-cad-border hover:border-cad-accent rounded text-cad-textDim hover:text-white"
                            title="Duplicate Piece"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deletePiece(piece.id)}
                            className="p-1.5 bg-cad-bg border border-cad-border hover:border-red-400 rounded text-cad-textDim hover:text-red-400"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Seam Allowance */}
                        <div className="flex items-center justify-between text-xs pt-1">
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
        {/* TAB 4: MEASUREMENTS & SIZING SPECS */}
        {/* ========================================================= */}
        {activeTab === 'measurements' && (
          <div className="space-y-4">
            {/* Standard Size Grading Selector */}
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Size Grading
              </span>
              <div className="grid grid-cols-6 gap-1">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`py-1.5 rounded font-mono text-xs font-bold transition border ${
                      activeSize === s
                        ? 'border-cad-accent bg-cad-accentSoft text-cad-accent shadow-sm'
                        : 'border-cad-border bg-cad-panelLight/40 text-cad-textMuted hover:border-cad-borderLight hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Parametric Measurement Sliders (Garment-specific) */}
            <div className="pt-2 border-t border-cad-border space-y-3">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block">
                Parametric POM Specs (mm)
              </span>

              <div className="space-y-2">
                {template.measurements.map((spec) => (
                  <SliderInput
                    key={spec.id}
                    label={spec.name}
                    value={measurements[spec.id] ?? spec.value}
                    min={spec.min}
                    max={spec.max}
                    step={spec.step}
                    unit="mm"
                    onChange={(v) => setMeasurement(spec.id, v)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
