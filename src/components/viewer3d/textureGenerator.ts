import * as THREE from 'three';
import { ArtworkLayer } from '../../types/artwork';
import { FabricMaterial } from '../../types/material';
import { BlankPiece } from './blankBuilderLoader';
import { imageCache } from '../../services/imageCache';

/**
 * Fallback piece centers in 2048x2048 texture sheet coordinate space:
 * Used if specific model piece bounds are not provided.
 */
const DEFAULT_PIECE_CENTERS: Record<string, { x: number; y: number; anchorYOffset?: number }> = {
  front: { x: 528, y: 1280, anchorYOffset: -160 }, // Front chest anchor is ~1120
  back: { x: 1520, y: 1280, anchorYOffset: -160 }, // Back neck/upper back is ~1120
  sleeveR: { x: 528, y: 315 },
  sleeveL: { x: 1520, y: 315 },
  pocket: { x: 256, y: 1850 },
  hoodR: { x: 1408, y: 253 },
  hoodL: { x: 1843, y: 253 },
  thighL: { x: 1792, y: 462 },
  thighR: { x: 1422, y: 462 },
  label: { x: 1024, y: 212 },
};

/**
 * Maps a pattern piece ID or placement zone to the corresponding 3D model piece ID
 */
export function mapPieceIdToModelPiece(pieceId?: string, zone?: string): string {
  const p = (pieceId || '').toLowerCase();
  const z = (zone || '').toLowerCase();

  // 1. Direct piece ID matching
  if (p.includes('front') || p.includes('front_body') || p.includes('front_leg')) {
    if (p.includes('leg')) return 'thighL';
    return 'front';
  }
  if (p.includes('back') || p.includes('back_body') || p.includes('back_leg')) {
    if (p.includes('leg')) return 'seatL';
    return 'back';
  }
  if (p.includes('sleeve_left') || p.includes('sleevel')) return 'sleeveL';
  if (p.includes('sleeve_right') || p.includes('sleever')) return 'sleeveR';
  if (p.includes('sleeve')) return 'sleeveL';
  if (p.includes('pocket')) return 'pocket';
  if (p.includes('hood_left') || p.includes('hoodl')) return 'hoodL';
  if (p.includes('hood_right') || p.includes('hoodr') || p.includes('hood')) return 'hoodR';
  if (p.includes('collar') || p.includes('neck')) return 'neckF';

  // 2. Fallback to placement zone
  if (z.includes('back')) return 'back';
  if (z.includes('sleeve-left')) return 'sleeveL';
  if (z.includes('sleeve-right')) return 'sleeveR';
  if (z.includes('pocket')) return 'pocket';
  if (z.includes('hood')) return 'hoodR';
  if (z.includes('thigh') || z.includes('pant-left')) return 'thighL';
  if (z.includes('pant-right')) return 'thighR';
  if (z.includes('inside-label')) return 'label';

  return 'front';
}

export function createGarmentDynamicTexture(
  material: FabricMaterial,
  artworkLayers: ArtworkLayer[],
  modelPieces?: BlankPiece[],
  pxPerCm: number = 16
): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // 1. Fill base garment dye color
  ctx.fillStyle = material.baseColor;
  ctx.fillRect(0, 0, size, size);

  // 2. Add realistic subtle fabric micro-grain texture
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  const noiseScale = (material.pbr.roughness || 0.8) * 5;

  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const idx = (y * size + x) * 4;
      const noise = ((x ^ y) % 7 === 0 ? 1 : -1) * (Math.random() * noiseScale);
      data[idx] = Math.min(255, Math.max(0, data[idx] + noise));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Build fast lookup map for model pieces
  const pieceMap = new Map<string, BlankPiece>();
  if (modelPieces) {
    modelPieces.forEach((p) => pieceMap.set(p.id, p));
  }

  const pxPerMm = pxPerCm / 10;

  // 4. Render Artwork Layers onto appropriate pattern piece zones
  artworkLayers.forEach((layer) => {
    if (!layer.visible) return;

    const modelTargetId = mapPieceIdToModelPiece(layer.pieceId, layer.zone);
    const pieceDef = pieceMap.get(modelTargetId);

    let centerX: number;
    let centerY: number;

    if (pieceDef && pieceDef.bounds) {
      centerX = (pieceDef.bounds.minX + pieceDef.bounds.maxX) / 2;
      centerY = (pieceDef.bounds.minY + pieceDef.bounds.maxY) / 2;

      // For front/back body: anchor chest/upper back slightly higher than pure geometric center
      if (modelTargetId === 'front' || modelTargetId === 'back') {
        const height = pieceDef.bounds.maxY - pieceDef.bounds.minY;
        centerY -= height * 0.12; // Standard chest height
      }
    } else {
      const fallback = DEFAULT_PIECE_CENTERS[modelTargetId] || DEFAULT_PIECE_CENTERS['front'];
      centerX = fallback.x;
      centerY = fallback.y + (fallback.anchorYOffset || 0);
    }

    // Offset in pixels from mm coordinates
    const posX = centerX + layer.x * pxPerMm;
    const posY = centerY + layer.y * pxPerMm;

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate((layer.rotation * Math.PI) / 180);

    // Apply scale and intentional user flipping
    const scaleX = layer.scale * (layer.flipH ? -1 : 1);
    const scaleY = layer.scale * (layer.flipV ? -1 : 1);
    ctx.scale(scaleX, scaleY);
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));

    if (layer.type === 'text' && layer.text) {
      const fontSize = (layer.fontSize || 36) * (pxPerMm * 1.5);
      ctx.font = `bold ${fontSize}px "${layer.fontFamily || 'Inter'}", -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Manufacturing Technique Styling
      if (layer.technique === 'puff-print') {
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
      } else if (layer.technique === 'embroidery') {
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1.5;
        ctx.shadowOffsetY = 2;
      } else if (layer.technique === 'screen-print') {
        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 1;
      }

      ctx.fillStyle = layer.textColor || '#ffffff';
      ctx.fillText(layer.text, 0, 0);

      // Embroidery thread highlight pass
      if (layer.technique === 'embroidery') {
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1.5;
        ctx.strokeText(layer.text, 0, 0);
      }
    } else if (layer.type === 'image' && layer.imageUrl) {
      const img = imageCache.getImageSync(layer.imageUrl);
      if (img && img.naturalWidth > 0) {
        // Physical dimensions in pixels
        const wMm = layer.width || 220;
        const hMm = layer.height || (wMm / (layer.aspectRatio || 1));
        const targetW = wMm * pxPerMm;
        const targetH = hMm * pxPerMm;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (layer.technique === 'puff-print') {
          ctx.shadowColor = 'rgba(0,0,0,0.45)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 5;
        } else if (layer.technique === 'screen-print') {
          ctx.shadowColor = 'rgba(0,0,0,0.15)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 0.5;
          ctx.shadowOffsetY = 1;
        }

        ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      }
    }

    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
