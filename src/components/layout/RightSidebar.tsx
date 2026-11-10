import React, { useRef } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Type,
  Trash2,
  Copy,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCw,
  Sparkles,
  Link2,
  Layers,
  UploadCloud,
  Check,
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDesignStore } from '../../store/useDesignStore';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { useSewingStore } from '../../store/useSewingStore';
import { useSceneStore } from '../../store/useSceneStore';
import { PrintTechnique } from '../../types/artwork';
import { FABRIC_LIBRARY, PANTONE_PALETTE } from '../../materials/library';
import { SliderInput } from '../common/SliderInput';

export const RightSidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedPieceId } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    assets,
    uploadAsset,
    layers,
    activeLayerId,
    setActiveLayerId,
    addTextLayer,
    addImageLayerFromAsset,
    updateLayer,
    removeLayer,
    duplicateLayer,
    reorderLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    flipLayerH,
    flipLayerV,
    alignLayer,
    loadDemoContent,
    clearAllLayers,
  } = useDesignStore();

  const { pieces } = useGarmentStore();

  const {
    material,
    setMaterialById,
    setColor,
    updatePbr,
    updatePhysics,
  } = useMaterialStore();

  const {
    relationships,
    removeRelationship,
    toggleFlipped,
    toggleEnabled,
    validateRelationships,
  } = useSewingStore();

  const {
    settings,
    setAvatarType,
    setLightingPreset,
    toggleWireframe,
    toggleSeamLines,
  } = useSceneStore();

  const activeLayer = layers.find((l) => l.id === activeLayerId);
  const sewingValidations = validateRelationships();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadAsset(file);
        // Automatically place on currently selected pattern piece
        const targetPieceId = selectedPieceId || pieces[0]?.id || 'piece_front_body';
        addImageLayerFromAsset(asset.id, targetPieceId);
      } catch (err) {
        console.error('Failed to upload graphic:', err);
      }
    }
  };

  const techniques: { id: PrintTechnique; name: string }[] = [
    { id: 'screen-print', name: 'Screen Print (Flat Plastisol)' },
    { id: 'puff-print', name: 'Puff Print 3D (Raised Ink)' },
    { id: 'dtg', name: 'Direct-to-Garment (DTG)' },
    { id: 'embroidery', name: 'Satin Embroidery Stitch' },
    { id: 'heat-transfer', name: 'Heat Transfer Vinyl' },
    { id: 'rhinestones', name: 'Rhinestone Embellishment' },
    { id: 'sublimation', name: 'Allover Sublimation' },
  ];

  return (
    <aside className="w-80 h-full bg-cad-panel border-l border-cad-border flex flex-col select-none overflow-hidden text-cad-text z-10">
      {/* Header Tabs */}
      <div className="grid grid-cols-4 border-b border-cad-border bg-cad-bg/50 p-1 text-[11px] font-medium text-center">
        <button
          onClick={() => setActiveTab('design')}
          className={`py-1.5 rounded transition ${
            activeTab === 'design'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          Artwork
        </button>
        <button
          onClick={() => setActiveTab('fabric')}
          className={`py-1.5 rounded transition ${
            activeTab === 'fabric'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          Fabric
        </button>
        <button
          onClick={() => setActiveTab('sewing')}
          className={`py-1.5 rounded transition ${
            activeTab === 'sewing'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          Sewing
        </button>
        <button
          onClick={() => setActiveTab('scene')}
          className={`py-1.5 rounded transition ${
            activeTab === 'scene'
              ? 'bg-cad-panelLight text-cad-accent font-semibold shadow-sm'
              : 'text-cad-textMuted hover:text-cad-text'
          }`}
        >
          3D Studio
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ========================================================= */}
        {/* TAB 1: DESIGN & ARTWORK */}
        {/* ========================================================= */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            {/* Upload & Add Actions */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded border border-cad-accent bg-cad-accentSoft/30 hover:bg-cad-accentSoft/60 flex items-center justify-center gap-1.5 text-xs font-semibold text-cad-accent transition shadow-sm"
              >
                <UploadCloud className="w-4 h-4 text-cad-accent" />
                <span>Upload Design</span>
              </button>

              <button
                onClick={() => {
                  const targetPieceId = selectedPieceId || pieces[0]?.id || 'piece_front_body';
                  addTextLayer(targetPieceId, 'BRAND LOGO');
                }}
                className="p-2.5 rounded border border-cad-border bg-cad-panelLight hover:border-cad-accent flex items-center justify-center gap-1.5 text-xs font-semibold text-cad-text hover:text-white transition"
              >
                <Type className="w-4 h-4 text-cad-accent" />
                <span>Add Typography</span>
              </button>
            </div>

            {/* Uploaded Assets Gallery (Reusable Library) */}
            {assets.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-cad-textMuted uppercase tracking-wider block mb-2">
                  Uploaded Assets ({assets.length})
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        const targetPieceId = selectedPieceId || pieces[0]?.id || 'piece_front_body';
                        addImageLayerFromAsset(asset.id, targetPieceId);
                      }}
                      className="group relative border border-cad-border hover:border-cad-accent rounded p-1 bg-cad-panelLight/40 hover:bg-cad-panelLight cursor-pointer transition text-center"
                      title={`Click to place "${asset.name}" on selected pattern piece`}
                    >
                      <div className="w-full h-14 flex items-center justify-center overflow-hidden rounded bg-black/40">
                        <img src={asset.dataUrl} alt={asset.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <span className="text-[10px] text-cad-textMuted truncate block mt-1 group-hover:text-white">
                        {asset.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artwork Layers on Garment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
                  Active Layers ({layers.length})
                </span>
                {layers.length > 0 ? (
                  <button
                    onClick={clearAllLayers}
                    className="text-[10px] text-red-400 hover:text-red-300 transition"
                  >
                    Clear All
                  </button>
                ) : (
                  <button
                    onClick={loadDemoContent}
                    className="text-[10px] text-cad-accent hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load Demo Artwork</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {layers.length === 0 ? (
                  <div className="text-center py-6 px-4 text-xs text-cad-textDim border border-dashed border-cad-border rounded">
                    Upload your transparent PNG, SVG, or graphic design to position on pattern pieces.
                  </div>
                ) : (
                  layers.map((layer) => {
                    const isSelected = activeLayerId === layer.id;
                    const piece = pieces.find((p) => p.id === layer.pieceId);
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayerId(layer.id)}
                        className={`p-2 rounded border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'border-cad-accent bg-cad-accentSoft/30 shadow-sm'
                            : 'border-cad-border bg-cad-panelLight/40 hover:border-cad-borderLight'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {layer.type === 'text' ? (
                            <Type className="w-3.5 h-3.5 text-cad-accent shrink-0" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <div className="truncate text-left">
                            <span className={`text-xs font-medium block truncate ${isSelected ? 'text-cad-accent' : 'text-cad-text'}`}>
                              {layer.name || (layer.type === 'text' ? layer.text : 'Graphic')}
                            </span>
                            <span className="text-[10px] text-cad-textDim block truncate">
                              Panel: {piece?.name || 'Front Body'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleLayerVisibility(layer.id)}
                            className="p-1 hover:text-cad-accent text-cad-textDim"
                            title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                          >
                            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
                          </button>
                          <button
                            onClick={() => toggleLayerLock(layer.id)}
                            className="p-1 hover:text-cad-accent text-cad-textDim"
                            title={layer.locked ? 'Unlock' : 'Lock'}
                          >
                            {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => duplicateLayer(layer.id)}
                            className="p-1 hover:text-cad-accent text-cad-textDim"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeLayer(layer.id)}
                            className="p-1 hover:text-red-400 text-cad-textDim"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Layer Inspector */}
            {activeLayer && (
              <div className="pt-3 border-t border-cad-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cad-accent uppercase tracking-wider">
                    Inspector: {activeLayer.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cad-bg border border-cad-border text-cad-textDim">
                    {activeLayer.type.toUpperCase()}
                  </span>
                </div>

                {/* Target Pattern Piece Assignment */}
                <div>
                  <label className="text-[11px] text-cad-textMuted block mb-1">Attached Pattern Piece</label>
                  <select
                    value={activeLayer.pieceId || pieces[0]?.id}
                    onChange={(e) => updateLayer(activeLayer.id, { pieceId: e.target.value })}
                    className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text focus:outline-none focus:border-cad-accent"
                  >
                    {pieces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Print Technique */}
                <div>
                  <label className="text-[11px] text-cad-textMuted block mb-1">Manufacturing Method</label>
                  <select
                    value={activeLayer.technique}
                    onChange={(e) => updateLayer(activeLayer.id, { technique: e.target.value as PrintTechnique })}
                    className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text focus:outline-none focus:border-cad-accent"
                  >
                    {techniques.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Typography Controls */}
                {activeLayer.type === 'text' && (
                  <div className="space-y-2 p-2 bg-cad-panelLight/40 rounded border border-cad-border">
                    <div>
                      <label className="text-[11px] text-cad-textMuted block mb-1">Text Content</label>
                      <input
                        type="text"
                        value={activeLayer.text || ''}
                        onChange={(e) => updateLayer(activeLayer.id, { text: e.target.value, name: e.target.value })}
                        className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text focus:outline-none focus:border-cad-accent font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-cad-textMuted block mb-1">Font Family</label>
                        <select
                          value={activeLayer.fontFamily || 'Inter'}
                          onChange={(e) => updateLayer(activeLayer.id, { fontFamily: e.target.value })}
                          className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text focus:outline-none focus:border-cad-accent"
                        >
                          <option value="Inter">Inter (Sans)</option>
                          <option value="Bebas Neue">Bebas Neue (Athletic)</option>
                          <option value="Montserrat">Montserrat (Clean)</option>
                          <option value="Playfair Display">Playfair Display (Serif)</option>
                          <option value="JetBrains Mono">JetBrains Mono (CAD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-cad-textMuted block mb-1">Text Color</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={activeLayer.textColor || '#ffffff'}
                            onChange={(e) => updateLayer(activeLayer.id, { textColor: e.target.value })}
                            className="w-7 h-7 rounded border border-cad-border cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={activeLayer.textColor || '#ffffff'}
                            onChange={(e) => updateLayer(activeLayer.id, { textColor: e.target.value })}
                            className="w-full bg-cad-bg border border-cad-border rounded px-1.5 py-0.5 text-xs font-mono text-cad-text uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Physical Dimensions (mm) with Aspect Ratio Lock */}
                <div className="p-2.5 bg-cad-panelLight/40 rounded border border-cad-border space-y-2">
                  <span className="text-[11px] font-semibold text-cad-textMuted uppercase tracking-wider block">
                    Dimensions (mm)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-cad-textDim block">Width (mm)</label>
                      <input
                        type="number"
                        value={activeLayer.width || 200}
                        onChange={(e) => updateLayer(activeLayer.id, { width: parseFloat(e.target.value) || 10 })}
                        className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs font-mono text-cad-text"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-cad-textDim block">Height (mm)</label>
                      <input
                        type="number"
                        value={activeLayer.height || 60}
                        onChange={(e) => updateLayer(activeLayer.id, { height: parseFloat(e.target.value) || 10 })}
                        className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs font-mono text-cad-text"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-cad-textMuted cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={activeLayer.aspectRatioLocked ?? true}
                      onChange={(e) => updateLayer(activeLayer.id, { aspectRatioLocked: e.target.checked })}
                      className="accent-cad-accent rounded cursor-pointer"
                    />
                    <span>Lock Aspect Ratio</span>
                  </label>
                </div>

                {/* Intentional Flip & Alignment Buttons */}
                <div className="p-2.5 bg-cad-panelLight/40 rounded border border-cad-border space-y-2">
                  <span className="text-[11px] font-semibold text-cad-textMuted uppercase tracking-wider block">
                    Flip & Alignment
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => flipLayerH(activeLayer.id)}
                      className={`flex-1 py-1.5 px-2 rounded border text-xs flex items-center justify-center gap-1 transition ${
                        activeLayer.flipH
                          ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold'
                          : 'border-cad-border bg-cad-bg text-cad-text hover:bg-cad-panelLight'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip H</span>
                    </button>
                    <button
                      onClick={() => flipLayerV(activeLayer.id)}
                      className={`flex-1 py-1.5 px-2 rounded border text-xs flex items-center justify-center gap-1 transition ${
                        activeLayer.flipV
                          ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold'
                          : 'border-cad-border bg-cad-bg text-cad-text hover:bg-cad-panelLight'
                      }`}
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span>Flip V</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <button
                      onClick={() => alignLayer(activeLayer.id, 'left')}
                      className="py-1 px-1 bg-cad-bg border border-cad-border hover:border-cad-accent rounded text-[10px] flex items-center justify-center gap-1 text-cad-textMuted hover:text-white"
                      title="Align Left"
                    >
                      <AlignLeft className="w-3 h-3" />
                      <span>Left</span>
                    </button>
                    <button
                      onClick={() => alignLayer(activeLayer.id, 'center')}
                      className="py-1 px-1 bg-cad-bg border border-cad-border hover:border-cad-accent rounded text-[10px] flex items-center justify-center gap-1 text-cad-textMuted hover:text-white"
                      title="Align Center"
                    >
                      <AlignCenter className="w-3 h-3" />
                      <span>Center</span>
                    </button>
                    <button
                      onClick={() => alignLayer(activeLayer.id, 'right')}
                      className="py-1 px-1 bg-cad-bg border border-cad-border hover:border-cad-accent rounded text-[10px] flex items-center justify-center gap-1 text-cad-textMuted hover:text-white"
                      title="Align Right"
                    >
                      <AlignRight className="w-3 h-3" />
                      <span>Right</span>
                    </button>
                  </div>
                </div>

                {/* Precision Sliders */}
                <div className="space-y-1 bg-cad-panelLight/40 p-2.5 rounded border border-cad-border">
                  <SliderInput
                    label="Offset X (mm)"
                    value={activeLayer.x}
                    min={-300}
                    max={300}
                    step={1}
                    unit="mm"
                    onChange={(v) => updateLayer(activeLayer.id, { x: v })}
                  />
                  <SliderInput
                    label="Offset Y (mm)"
                    value={activeLayer.y}
                    min={-400}
                    max={400}
                    step={1}
                    unit="mm"
                    onChange={(v) => updateLayer(activeLayer.id, { y: v })}
                  />
                  <SliderInput
                    label="Scale Factor"
                    value={activeLayer.scale}
                    min={0.2}
                    max={3.0}
                    step={0.05}
                    unit="x"
                    onChange={(v) => updateLayer(activeLayer.id, { scale: v })}
                  />
                  <SliderInput
                    label="Rotation Angle"
                    value={activeLayer.rotation}
                    min={-180}
                    max={180}
                    step={1}
                    unit="°"
                    onChange={(v) => updateLayer(activeLayer.id, { rotation: v })}
                  />
                  <SliderInput
                    label="Opacity"
                    value={activeLayer.opacity}
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    unit="%"
                    onChange={(v) => updateLayer(activeLayer.id, { opacity: v })}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FABRIC & MATERIALS */}
        {/* ========================================================= */}
        {activeTab === 'fabric' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Fabric Substrates
              </span>
              <div className="space-y-2">
                {FABRIC_LIBRARY.map((fab) => {
                  const isSelected = material.id === fab.id;
                  return (
                    <div
                      key={fab.id}
                      onClick={() => setMaterialById(fab.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'border-cad-accent bg-cad-accentSoft/30 shadow-sm'
                          : 'border-cad-border bg-cad-panelLight/40 hover:border-cad-borderLight'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-cad-accent' : 'text-cad-text'}`}>
                          {fab.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cad-bg border border-cad-border text-cad-textDim">
                          {fab.physics.weightGSM} GSM
                        </span>
                      </div>
                      <p className="text-[11px] text-cad-textMuted leading-relaxed">
                        {fab.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pantone Fashion Swatches */}
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Color Swatches (Pantone)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {PANTONE_PALETTE.map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() => setColor(swatch.hex)}
                    style={{ backgroundColor: swatch.hex }}
                    className={`h-9 rounded-md border transition transform hover:scale-110 relative ${
                      material.baseColor === swatch.hex
                        ? 'border-cad-accent ring-2 ring-cad-accent/50 scale-105'
                        : 'border-white/10'
                    }`}
                    title={`${swatch.name} (${swatch.hex})`}
                  >
                    {material.baseColor === swatch.hex && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* PBR Material Controls */}
            <div className="pt-2 border-t border-cad-border space-y-2">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block">
                PBR Surface Micro-Texture
              </span>
              <SliderInput
                label="Fabric Roughness"
                value={material.pbr.roughness}
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={(v) => updatePbr({ roughness: v })}
              />
              <SliderInput
                label="Cotton Weave Relief"
                value={material.pbr.normalScale}
                min={0.1}
                max={2.5}
                step={0.1}
                onChange={(v) => updatePbr({ normalScale: v })}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SEWING RELATIONSHIPS */}
        {/* ========================================================= */}
        {activeTab === 'sewing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider">
                Seams & Stitches ({relationships.length})
              </span>
            </div>

            <div className="space-y-2">
              {relationships.map((rel) => {
                const pieceA = pieces.find((p) => p.id === rel.pieceAId);
                const pieceB = pieces.find((p) => p.id === rel.pieceBId);
                const validation = sewingValidations.find((v) => v.relationshipId === rel.id);
                const isMatch = validation ? validation.status === 'perfect' || validation.status === 'acceptable' : true;

                return (
                  <div key={rel.id} className="p-2.5 rounded border border-cad-border bg-cad-panelLight/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{rel.name || 'Seam Join'}</span>
                      <button
                        onClick={() => removeRelationship(rel.id)}
                        className="text-cad-textDim hover:text-red-400"
                        title="Remove Seam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-cad-textMuted flex items-center justify-between">
                      <span>{pieceA?.name || 'Piece A'} ↔ {pieceB?.name || 'Piece B'}</span>
                      <span className="font-mono text-cad-accent">{rel.seamType}</span>
                    </div>

                    {validation && (
                      <div className={`p-1.5 rounded text-[10px] flex items-center gap-1.5 ${
                        isMatch ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                      }`}>
                        <span>{isMatch ? 'Match: Within 5mm tolerance' : `Mismatch: Δ ${validation.difference.toFixed(1)}mm`}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: 3D STUDIO SCENE */}
        {/* ========================================================= */}
        {activeTab === 'scene' && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Display Form
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAvatarType('hanger')}
                  className={`p-2 rounded border text-xs font-semibold transition ${
                    settings.avatarType === 'hanger'
                      ? 'border-cad-accent bg-cad-accentSoft text-cad-accent'
                      : 'border-cad-border bg-cad-panelLight text-cad-text hover:bg-cad-panelLight/80'
                  }`}
                >
                  Timber Hanger
                </button>
                <button
                  onClick={() => setAvatarType('none')}
                  className={`p-2 rounded border text-xs font-semibold transition ${
                    settings.avatarType === 'none'
                      ? 'border-cad-accent bg-cad-accentSoft text-cad-accent'
                      : 'border-cad-border bg-cad-panelLight text-cad-text hover:bg-cad-panelLight/80'
                  }`}
                >
                  Floating Ghost
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Lighting Atmosphere
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['studio-clean', 'warm-editorial', 'dramatic-rim', 'cyberpunk-neon'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setLightingPreset(preset)}
                    className={`p-2 rounded border text-xs capitalize transition ${
                      settings.lightingPreset === preset
                        ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold'
                        : 'border-cad-border bg-cad-panelLight text-cad-text hover:bg-cad-panelLight/80'
                    }`}
                  >
                    {preset.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-cad-border space-y-2">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block">
                Wireframe & Overlays
              </span>
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                <span className="text-cad-textMuted">Polygon Mesh Wireframe</span>
                <input
                  type="checkbox"
                  checked={settings.wireframe}
                  onChange={toggleWireframe}
                  className="accent-cad-accent rounded cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                <span className="text-cad-textMuted">3D Seam Stitching Threads</span>
                <input
                  type="checkbox"
                  checked={settings.showSeamLines}
                  onChange={toggleSeamLines}
                  className="accent-cad-accent rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
