import * as THREE from 'three';
import { ArtworkLayer } from '../../types/artwork';
import { FabricMaterial } from '../../types/material';

/**
 * Procedurally generates an ultra-crisp 2048x2048 canvas texture combining
 * the fabric substrate weave and all attached artwork layers with accurate placement.
 */
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
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Fill base garment color
  ctx.fillStyle = material.baseColor;
  ctx.fillRect(0, 0, size, size);

  // 2. Micro-texture weave simulation
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  const grainStrength = material.pbr.roughness * 12;

  // Add subtle deterministic weave noise
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const idx = (y * size + x) * 4;
      const noise = ((x ^ y) % 5 === 0 ? 1 : -1) * (Math.random() * grainStrength);
      data[idx] = Math.min(255, Math.max(0, data[idx] + noise));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Render Artwork Layers onto Front Body Chest (Center UV: X: 1024, Y: 850)
  artworkLayers.forEach((layer) => {
    if (!layer.visible) return;

    ctx.save();
    // Front chest coordinate center
    const centerX = size * 0.5 + layer.x * 2.2;
    const centerY = size * 0.42 + layer.y * 2.2;

    ctx.translate(centerX, centerY);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.scale, layer.scale);
    ctx.globalAlpha = layer.opacity;

    if (layer.type === 'text' && layer.text) {
      const fontSize = (layer.fontSize || 36) * 3;
      ctx.font = `bold ${fontSize}px "${layer.fontFamily || 'Inter'}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Puff print or embroidery shadow effect
      if (layer.technique === 'puff-print') {
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
      } else if (layer.technique === 'embroidery') {
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
      }

      ctx.fillStyle = layer.textColor || '#ffffff';
      ctx.fillText(layer.text, 0, 0);
    } else if (layer.type === 'image' && layer.imageUrl) {
      const img = new window.Image();
      img.src = layer.imageUrl;
      if (img.complete && img.naturalWidth > 0) {
        const w = 400;
        const h = (img.naturalHeight / img.naturalWidth) * w;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      }
    }

    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

