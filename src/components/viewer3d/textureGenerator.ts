import * as THREE from 'three';
import { ArtworkLayer } from '../../types/artwork';
import { FabricMaterial } from '../../types/material';

/**
 * BlankBuilder exact UV piece coordinates in 2048x2048 sheet:
 * - front body: Center X=528, Center Y=1281 (Chest anchor is ~1120)
 * - back body: Center X=1520, Center Y=1280 (Upper back anchor is ~1120)
 * - sleeveR: Center X=528, Center Y=315
 * - sleeveL: Center X=1520, Center Y=315
 * - label: Center X=1024, Center Y=212
 * 
 * pxPerCm = 16 => 1 mm = 1.6 pixels.
 */
export const BLANK_PIECE_CENTERS = {
  'front-chest': { x: 528, y: 1120 },
  'front-center': { x: 528, y: 1250 },
  'front-pocket': { x: 420, y: 1050 },
  'back-full': { x: 1520, y: 1250 },
  'back-neck': { x: 1520, y: 920 },
  'sleeve-left': { x: 1520, y: 315 },
  'sleeve-right': { x: 528, y: 315 },
  'inside-label': { x: 1024, y: 212 },
};

export function createGarmentDynamicTexture(
  material: FabricMaterial,
  artworkLayers: ArtworkLayer[]
): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const t = new THREE.CanvasTexture(canvas);
    t.flipY = false;
    return t;
  }

  // 1. Fill base garment dye color
  ctx.fillStyle = material.baseColor;
  ctx.fillRect(0, 0, size, size);

  // 2. Add subtle fabric micro-grain texture
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  const noiseScale = material.pbr.roughness * 6;

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

  // 3. Render Artwork Layers onto appropriate pattern piece zones
  artworkLayers.forEach((layer) => {
    if (!layer.visible) return;

    const baseAnchor = BLANK_PIECE_CENTERS[layer.zone as keyof typeof BLANK_PIECE_CENTERS] || BLANK_PIECE_CENTERS['front-chest'];

    ctx.save();

    // 1mm = 1.6px in BlankBuilder's 2048 space
    const posX = baseAnchor.x + layer.x * 1.6;
    const posY = baseAnchor.y + layer.y * 1.6;

    ctx.translate(posX, posY);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.scale, layer.scale);
    ctx.globalAlpha = layer.opacity;

    if (layer.type === 'text' && layer.text) {
      const fontSize = (layer.fontSize || 36) * 2.8;
      ctx.font = `bold ${fontSize}px "${layer.fontFamily || 'Inter'}", -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Manufacturing Technique Styling
      if (layer.technique === 'puff-print') {
        // High density raised 3D puff print shadow
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
      } else if (layer.technique === 'embroidery') {
        // Satin embroidery stitch bevel
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1.5;
        ctx.shadowOffsetY = 2;
      } else if (layer.technique === 'screen-print') {
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0.5;
        ctx.shadowOffsetY = 1;
      }

      ctx.fillStyle = layer.textColor || '#ffffff';
      ctx.fillText(layer.text, 0, 0);

      // Embroidery thread highlight pass
      if (layer.technique === 'embroidery') {
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.strokeText(layer.text, 0, 0);
      }
    } else if (layer.type === 'image' && layer.imageUrl) {
      const img = new Image();
      img.src = layer.imageUrl;
      if (img.complete && img.naturalWidth > 0) {
        const targetW = 450;
        const targetH = (img.naturalHeight / img.naturalWidth) * targetW;
        if (layer.technique === 'puff-print') {
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 5;
        }
        ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      }
    }

    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // Required for exact UV alignment with model.bin
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
