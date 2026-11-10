import React, { useRef } from 'react';
import {
  Palette,
  Image,
  Type,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  SlidersHorizontal,
  Shirt,
  Sparkles,
  Link2,
  Camera,
  Sun,
  User,
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useDesignStore } from '../../store/useDesignStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { useSewingStore } from '../../store/useSewingStore';
import { useSceneStore } from '../../store/useSceneStore';
import { PlacementZone, PrintTechnique } from '../../types/artwork';
import { FABRIC_LIBRARY, PANTONE_PALETTE } from '../../materials/library';
import { SliderInput } from '../common/SliderInput';

export const RightSidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stores
  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    addTextLayer,
    addImageLayer,
    updateLayer,
    removeLayer,
    duplicateLayer,
    reorderLayer,
    toggleLayerVisibility,
    toggleLayerLock,
  } = useDesignStore();

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
    updateSettings,
  } = useSceneStore();

  const activeLayer = layers.find((l) => l.id === activeLayerId);
  const sewingValidations = validateRelationships();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addImageLayer(event.target.result as string, file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const placementZones: { id: PlacementZone; name: string }[] = [
    { id: 'front-chest', name: 'Front Chest' },
    { id: 'front-center', name: 'Center Front (Full)' },
    { id: 'front-pocket', name: 'Front Pocket' },
    { id: 'back-full', name: 'Full Back' },
    { id: 'back-neck', name: 'Back Neck Yoke' },
    { id: 'sleeve-left', name: 'Left Sleeve' },
    { id: 'sleeve-right', name: 'Right Sleeve' },
    { id: 'inside-label', name: 'Inside Neck Label' },
    { id: 'hood-center', name: 'Hood Center' },
  ];

  const techniques: { id: PrintTechnique; name: string }[] = [
    { id: 'screen-print', name: 'Screen Print' },
    { id: 'puff-print', name: 'Puff Print 3D' },
    { id: 'dtg', name: 'Direct-to-Garment (DTG)' },
    { id: 'embroidery', name: 'Embroidery Stitch' },
    { id: 'heat-transfer', name: 'Heat Transfer' },
    { id: 'rhinestones', name: 'Rhinestone Bedazzle' },
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
          3D Scene
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ========================================================= */}
        {/* TAB 1: DESIGN & ARTWORK */}
        {/* ========================================================= */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            {/* Quick Add Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded border border-cad-border bg-cad-panelLight hover:border-cad-accent flex items-center justify-center gap-1.5 text-xs font-semibold text-cad-text hover:text-white transition"
              >
                <Image className="w-4 h-4 text-cad-accent" />
                <span>Upload Graphic</span>
              </button>

              <button
                onClick={() => addTextLayer('front-chest')}
                className="p-2 rounded border border-cad-border bg-cad-panelLight hover:border-cad-accent flex items-center justify-center gap-1.5 text-xs font-semibold text-cad-text hover:text-white transition"
              >
                <Type className="w-4 h-4 text-cad-accent" />
                <span>Add Typography</span>
              </button>
            </div>

            {/* Layer Stack */}
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Layers ({layers.length})
              </span>
              <div className="space-y-1.5">
                {layers.length === 0 ? (
                  <div className="text-center py-6 text-xs text-cad-textDim border border-dashed border-cad-border rounded">
                    No artwork layers yet. Upload an image or add typography.
                  </div>
                ) : (
                  layers.map((layer, idx) => {
                    const isSelected = activeLayerId === layer.id;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayerId(layer.id)}
                        className={`p-2 rounded border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'border-cad-accent bg-cad-accentSoft/30'
                            : 'border-cad-border bg-cad-panelLight/40 hover:border-cad-borderLight'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {layer.type === 'text' ? (
                            <Type className="w-3.5 h-3.5 text-cad-accent shrink-0" />
                          ) : (
                            <Image className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className={`text-xs font-medium truncate ${isSelected ? 'text-cad-accent' : 'text-cad-text'}`}>
                            {layer.name || (layer.type === 'text' ? layer.text : 'Graphic')}
                          </span>
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

            {/* Selected Layer Properties */}
            {activeLayer && (
              <div className="pt-3 border-t border-cad-border space-y-3">
                <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block">
                  Layer Properties: {activeLayer.name}
                </span>

                {/* Placement Zone */}
                <div>
                  <label className="text-[11px] text-cad-textMuted block mb-1">Placement Zone</label>
                  <select
                    value={activeLayer.zone}
                    onChange={(e) => updateLayer(activeLayer.id, { zone: e.target.value as PlacementZone })}
                    className="w-full bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs text-cad-text focus:outline-none focus:border-cad-accent"
                  >
                    {placementZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Print Technique */}
                <div>
                  <label className="text-[11px] text-cad-textMuted block mb-1">Manufacturing Technique</label>
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

                {/* Typography Specifics */}
                {activeLayer.type === 'text' && (
                  <div className="space-y-2 p-2.5 bg-cad-panelLight/40 rounded border border-cad-border">
                    <div>
                      <label className="text-[11px] text-cad-textMuted block mb-1">Text Content</label>
                      <input
                        type="text"
                        value={activeLayer.text || ''}
                        onChange={(e) => updateLayer(activeLayer.id, { text: e.target.value })}
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

                    <SliderInput
                      label="Letter Spacing"
                      value={activeLayer.letterSpacing || 0}
                      min={-2}
                      max={20}
                      step={0.5}
                      unit="px"
                      onChange={(v) => updateLayer(activeLayer.id, { letterSpacing: v })}
                    />
                  </div>
                )}

                {/* Transform Sliders */}
                <div className="space-y-1 bg-cad-panelLight/40 p-2.5 rounded border border-cad-border">
                  <SliderInput
                    label="Position X"
                    value={activeLayer.x}
                    min={-250}
                    max={250}
                    step={1}
                    unit="mm"
                    onChange={(v) => updateLayer(activeLayer.id, { x: v })}
                  />
                  <SliderInput
                    label="Position Y"
                    value={activeLayer.y}
                    min={-350}
                    max={350}
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
                    label="Rotation"
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
            {/* Fabric Preset Library */}
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

            {/* Color Palette (Pantone Swatches + Hex Picker) */}
            <div className="pt-3 border-t border-cad-border">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Garment Colorway
              </span>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="color"
                  value={material.baseColor}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-cad-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={material.baseColor}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-cad-bg border border-cad-border rounded px-2 py-1 text-xs font-mono text-cad-text uppercase focus:outline-none focus:border-cad-accent"
                />
              </div>

              {/* Curated Pantone Swatches */}
              <div className="grid grid-cols-5 gap-1.5">
                {PANTONE_PALETTE.map((swatch) => (
                  <button
                    key={swatch.hex}
                    onClick={() => setColor(swatch.hex)}
                    style={{ backgroundColor: swatch.hex }}
                    className={`h-7 rounded border transition shadow-inner relative group ${
                      material.baseColor.toLowerCase() === swatch.hex.toLowerCase()
                        ? 'border-cad-accent ring-2 ring-cad-accent/50'
                        : 'border-cad-border hover:scale-105'
                    }`}
                    title={swatch.name}
                  />
                ))}
              </div>
            </div>

            {/* PBR & Physics Properties */}
            <div className="pt-3 border-t border-cad-border space-y-2">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block">
                Fabric Draping & Texture (BlankBuilder)
              </span>
              <div className="space-y-1 bg-cad-panelLight/40 p-2.5 rounded border border-cad-border">
                <SliderInput
                  label="Cloth Wrinkles & Relief"
                  description="Adjust depth of cloth folds, natural gravity wrinkles, and seam creases"
                  value={material.pbr.normalScale}
                  min={0.0}
                  max={2.0}
                  step={0.05}
                  onChange={(v) => updatePbr({ normalScale: v })}
                />
                <SliderInput
                  label="Fabric Matte / Roughness"
                  description="Cotton jersey matte absorption vs synthetic luster"
                  value={material.pbr.roughness}
                  min={0.2}
                  max={1.0}
                  step={0.02}
                  onChange={(v) => updatePbr({ roughness: v })}
                />
                <SliderInput
                  label="Micro-Sheen / Luster"
                  value={material.pbr.sheen}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  onChange={(v) => updatePbr({ sheen: v })}
                />
                <SliderInput
                  label="Fabric Weight"
                  value={material.physics.weightGSM}
                  min={120}
                  max={600}
                  step={10}
                  unit="GSM"
                  onChange={(v) => updatePhysics({ weightGSM: v })}
                />
                <SliderInput
                  label="Weft Stretch (X)"
                  value={material.physics.stretchX * 100}
                  min={0}
                  max={80}
                  step={1}
                  unit="%"
                  onChange={(v) => updatePhysics({ stretchX: v / 100 })}
                />
                <SliderInput
                  label="Bend Stiffness"
                  value={material.physics.bendStiffness * 100}
                  min={10}
                  max={100}
                  step={5}
                  unit="%"
                  onChange={(v) => updatePhysics({ bendStiffness: v / 100 })}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SEWING & SEAMS */}
        {/* ========================================================= */}
        {activeTab === 'sewing' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Active Seams ({relationships.length})
              </span>
              <div className="space-y-2">
                {relationships.map((rel) => {
                  const val = sewingValidations.find((v) => v.relationshipId === rel.id);

                  return (
                    <div
                      key={rel.id}
                      className="p-2.5 rounded-lg border border-cad-border bg-cad-panelLight/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-cad-text flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-cad-accent" />
                          <span>{rel.name}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFlipped(rel.id)}
                            className="p-1 hover:text-cad-accent text-cad-textDim"
                            title="Flip Stitch Direction"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeRelationship(rel.id)}
                            className="p-1 hover:text-red-400 text-cad-textDim"
                            title="Delete Seam"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Edge Validation Badge */}
                      {val && (
                        <div
                          className={`p-1.5 rounded text-[11px] flex items-center gap-1.5 ${
                            val.status === 'perfect' || val.status === 'acceptable'
                              ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-800/40'
                              : 'bg-amber-950/30 text-amber-400 border border-amber-800/40'
                          }`}
                        >
                          {val.status === 'perfect' || val.status === 'acceptable' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{val.message}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-cad-textDim pt-1 border-t border-cad-border/50">
                        <span>Seam: <strong className="text-cad-text uppercase">{rel.seamType}</strong></span>
                        <span>Diff: <strong className="text-cad-text font-mono">{((val?.difference || 0) / 10).toFixed(1)} cm</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: 3D SCENE & AVATAR */}
        {/* ========================================================= */}
        {activeTab === 'scene' && (
          <div className="space-y-4">
            {/* Avatar Selector */}
            <div>
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Mannequin & Avatar
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'mannequin', name: 'Mannequin' },
                  { id: 'male-athletic', name: 'Male Athletic' },
                  { id: 'female-curvy', name: 'Female Curvy' },
                  { id: 'hanger', name: 'Hanger Display' },
                ].map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setAvatarType(av.id as any)}
                    className={`p-2 rounded text-xs font-medium border text-center transition ${
                      settings.avatarType === av.id
                        ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold'
                        : 'border-cad-border bg-cad-panelLight/40 text-cad-textMuted hover:text-white'
                    }`}
                  >
                    {av.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting Studio Presets */}
            <div className="pt-3 border-t border-cad-border">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Lighting Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'studio-clean', name: 'Clean Studio' },
                  { id: 'warm-editorial', name: 'Warm Editorial' },
                  { id: 'dramatic-rim', name: 'Dramatic Rim' },
                  { id: 'cyberpunk-neon', name: 'Cyberpunk Neon' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setLightingPreset(preset.id as any)}
                    className={`p-2 rounded text-xs font-medium border text-center transition ${
                      settings.lightingPreset === preset.id
                        ? 'border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold'
                        : 'border-cad-border bg-cad-panelLight/40 text-cad-textMuted hover:text-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Viewport Render Controls */}
            <div className="pt-3 border-t border-cad-border space-y-2">
              <span className="text-xs font-semibold text-cad-text uppercase tracking-wider block mb-2">
                Simulation Visualization
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Wireframe Mesh</span>
                  <input
                    type="checkbox"
                    checked={settings.wireframe}
                    onChange={toggleWireframe}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded hover:bg-cad-panelLight">
                  <span className="text-cad-textMuted">Render 3D Seam Lines</span>
                  <input
                    type="checkbox"
                    checked={settings.showSeamLines}
                    onChange={toggleSeamLines}
                    className="accent-cad-accent rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

