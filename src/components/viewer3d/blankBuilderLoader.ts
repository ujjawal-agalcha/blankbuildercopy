import * as THREE from 'three';
import { gunzipSync } from 'fflate';

export interface BlankPiece {
  id: string; // 'front' | 'back' | 'sleeveL' | 'sleeveR' | 'neckF' | 'neckB' | 'hemF' | 'hemB' | 'cuffL' | 'cuffR' | 'label'
  pts: [number, number][]; // 2D contour points in 2048x2048 texture sheet coordinate space
  bounds?: { minX: number; minY: number; maxX: number; maxY: number };
}

export interface BlankModelData {
  id: string;
  size: number; // 2048
  pxPerCm: number; // 16
  pieces: BlankPiece[];
  normalMapUrl: string;
  shirtGeometry: THREE.BufferGeometry;
  stitchGeometry?: THREE.BufferGeometry;
  hangerGeometry?: THREE.BufferGeometry;
  hookGeometry?: THREE.BufferGeometry;
  meta: any;
}

// Memory cache for decoded models
const modelCache = new Map<string, BlankModelData>();

export async function loadBlankBuilderModel(modelPath: string, normalMapPath: string): Promise<BlankModelData> {
  if (modelCache.has(modelPath)) {
    return modelCache.get(modelPath)!;
  }

  const response = await fetch(modelPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch model binary at ${modelPath}: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const compressedBytes = new Uint8Array(arrayBuffer);
  const uncompressed = gunzipSync(compressedBytes);
  const YT = uncompressed.buffer.slice(uncompressed.byteOffset, uncompressed.byteOffset + uncompressed.byteLength);

  const dataView = new DataView(YT);
  const jsonLen = dataView.getUint32(0, true);
  const binOffset = 4 + jsonLen;
  const meta = JSON.parse(new TextDecoder().decode(new Uint8Array(YT, 4, jsonLen)));

  // De-interleave helper from BlankBuilder
  const deinterleave = (field: any, byteWidth: number): ArrayBuffer => {
    const n = field.n;
    const src = new Uint8Array(YT, binOffset + field['@'], n * byteWidth);
    const dst = new Uint8Array(n * byteWidth);
    for (let b = 0; b < byteWidth; b++) {
      for (let i = 0, srcIdx = b * n; i < n; i++) {
        dst[i * byteWidth + b] = src[srcIdx + i];
      }
    }
    return dst.buffer;
  };

  // Decode field attribute
  const decodeField = (field: any): Float32Array | Uint32Array | Uint16Array => {
    if (field.e === 'i8') {
      const raw = new Int8Array(YT.slice(binOffset + field['@'], binOffset + field['@'] + field.n));
      const out = new Float32Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        out[i] = raw[i] / 127.0;
      }
      return out;
    }

    if (field.e === 'q16d') {
      const raw = new Int16Array(deinterleave(field, 2));
      const compCount = field.c;
      const out = new Float32Array(field.n);
      const accum = new Int32Array(compCount);
      for (let i = 0; i < field.n; i++) {
        const comp = i % compCount;
        accum[comp] = (accum[comp] + raw[i]) & 0xffff;
        out[i] = field.lo[comp] + (accum[comp] / 0xffff) * (field.hi[comp] - field.lo[comp]);
      }
      return out;
    }

    if (field.e === 'zz32d') {
      const raw = new Uint32Array(deinterleave(field, 4));
      const out = field.big ? new Uint32Array(field.n) : new Uint16Array(field.n);
      let accum = 0;
      for (let i = 0; i < field.n; i++) {
        const v = raw[i];
        accum += (v >>> 1) ^ -(v & 1);
        out[i] = accum;
      }
      return out;
    }

    throw new Error(`Unknown encoding ${field.e}`);
  };

  // Build Three.js BufferGeometry helper
  const createGeometryFromMeshDef = (meshDef: any): THREE.BufferGeometry | undefined => {
    if (!meshDef || !meshDef.pos || !meshDef.idx) return undefined;

    const pos = decodeField(meshDef.pos) as Float32Array;
    const nor = meshDef.nor ? (decodeField(meshDef.nor) as Float32Array) : undefined;
    const uv = meshDef.uv ? (decodeField(meshDef.uv) as Float32Array) : undefined;
    const idx = decodeField(meshDef.idx) as Uint32Array | Uint16Array;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    if (nor) geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    if (uv) geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));

    if (!nor) geo.computeVertexNormals();
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  };

  const shirtGeo = createGeometryFromMeshDef(meta.shirt);
  if (!shirtGeo) {
    throw new Error('Failed to decode shirt mesh from model binary');
  }

  const stitchGeo = createGeometryFromMeshDef(meta.stitch);
  const hangerGeo = createGeometryFromMeshDef(meta.hanger);
  const hookGeo = createGeometryFromMeshDef(meta.hook);

  // Compute bounding boxes for pattern pieces in UV space
  const pieces: BlankPiece[] = (meta.pieces || []).map((p: any) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of p.pts) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    return {
      id: p.id,
      pts: p.pts,
      bounds: { minX, minY, maxX, maxY },
    };
  });

  const modelData: BlankModelData = {
    id: meta.id || 'tee',
    size: meta.size || 2048,
    pxPerCm: meta.pxPerCm || 16,
    pieces,
    normalMapUrl: normalMapPath,
    shirtGeometry: shirtGeo,
    stitchGeometry: stitchGeo,
    hangerGeometry: hangerGeo,
    hookGeometry: hookGeo,
    meta,
  };

  modelCache.set(modelPath, modelData);
  return modelData;
}

