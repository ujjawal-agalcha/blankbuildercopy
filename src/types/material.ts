export interface FabricPhysics {
  weightGSM: number;      // Grams per square meter (e.g. 240 GSM)
  thickness: number;      // In mm (e.g. 0.8 mm)
  stretchX: number;       // Weft stretch % (0 to 1)
  stretchY: number;       // Warp stretch % (0 to 1)
  bendStiffness: number;  // Resistance to bending (0 to 1)
  shearStiffness: number; // Resistance to shear (0 to 1)
  friction: number;       // Friction against avatar/skin (0 to 1)
  drapeFactor: number;    // Drape coefficient (0 to 1)
}

export interface FabricPBR {
  roughness: number;      // 0 to 1
  metallic: number;       // 0 to 1
  clearcoat: number;      // 0 to 1
  sheen: number;          // 0 to 1 (velvet/cotton microfiber sheen)
  sheenColor: string;
  normalScale: number;    // Bump / weave depth
  weaveScale: number;     // Repeat frequency of weave pattern
  specularIntensity: number;
}

export interface FabricMaterial {
  id: string;
  name: string;
  code: string;
  type: 'jersey' | 'fleece' | 'french-terry' | 'denim' | 'twill' | 'rib' | 'leather' | 'silk' | 'nylon';
  description: string;
  baseColor: string;
  pbr: FabricPBR;
  physics: FabricPhysics;
  texturePattern?: string; // CSS pattern or generated procedural canvas texture
}

