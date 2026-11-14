/**
 * THREADCAD 3D — PATTERN-DRIVEN 3D GARMENT COMPONENT
 * Renders an assembled 3D garment directly generated from 2D pattern pieces.
 * 2D pattern dimension changes and vertex edits immediately update the 3D mesh.
 */

import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { PatternPiece } from '../../types/cad';
import { SewingRelationship } from '../../types/sewing';
import { FabricMaterial } from '../../types/material';
import { ArtworkLayer } from '../../types/artwork';
import { SceneSettings } from '../../types/scene';
import { assemblePatternDrivenGarment, GarmentAssemblyResult } from '../../geometry/patternMesh3D';
import { createGarmentDynamicTexture } from './textureGenerator';

interface PatternGarment3DProps {
  pieces: PatternPiece[];
  relationships: SewingRelationship[];
  measurements: Record<string, number>;
  material: FabricMaterial;
  layers: ArtworkLayer[];
  settings: SceneSettings;
  normalTexture?: THREE.Texture | null;
  onAssemblyStats?: (stats: GarmentAssemblyResult) => void;
}

export const PatternGarment3D: React.FC<PatternGarment3DProps> = ({
  pieces,
  relationships,
  measurements,
  material,
  layers,
  settings,
  normalTexture,
  onAssemblyStats,
}) => {
  // 1. Live Assembly: whenever pieces, relationships, or measurements change, regenerate 3D geometry
  const assembly = useMemo(() => {
    return assemblePatternDrivenGarment(pieces, relationships, measurements);
  }, [pieces, relationships, measurements]);

  // Report assembly statistics to parent
  useEffect(() => {
    onAssemblyStats?.(assembly);
  }, [assembly, onAssemblyStats]);

  // 2. Dynamic 2048x2048 canvas texture containing fabric color & artwork layers
  const dynamicTexture = useMemo(() => {
    return createGarmentDynamicTexture(material, layers, undefined, 16);
  }, [material.baseColor, material.pbr.roughness, layers]);

  // 3. Shared High-Grade Cotton Jersey PBR Material
  const fabricMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: dynamicTexture,
      roughness: Math.max(0.65, material.pbr.roughness),
      metalness: material.pbr.metallic || 0.02,
      wireframe: settings.wireframe,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });

    if (normalTexture) {
      mat.normalMap = normalTexture;
      const relief = material.pbr.normalScale || 0.8;
      mat.normalScale = new THREE.Vector2(relief, relief);
    }

    return mat;
  }, [dynamicTexture, normalTexture, material.pbr.roughness, material.pbr.metallic, material.pbr.normalScale, settings.wireframe]);

  // 4. Seam Stitching Material
  const seamThreadMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0x10b981,
      linewidth: 2,
    });
  }, []);

  return (
    <group position={[0, -2, 0]}>
      {/* 1. Assembled 3D Pattern Panels */}
      {assembly.panels.map((panel) => (
        <mesh
          key={panel.pieceId}
          geometry={panel.geometry}
          material={fabricMaterial}
          position={panel.worldPosition}
          castShadow
          receiveShadow
        />
      ))}

      {/* 2. Visual 3D Seam Stitching Lines (when enabled in settings) */}
      {settings.showSeamLines &&
        assembly.seamLines.map((seam) => {
          const points = seam.points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <line key={seam.id} geometry={lineGeo}>
              <lineBasicMaterial
                color={seam.status === 'mismatch' ? '#ef4444' : '#10b981'}
                linewidth={2}
              />
            </line>
          );
        })}
    </group>
  );
};

