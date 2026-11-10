import React, { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { useDesignStore } from '../../store/useDesignStore';
import { useSceneStore } from '../../store/useSceneStore';
import { loadBlankBuilderModel, BlankModelData } from './blankBuilderLoader';
import { createGarmentDynamicTexture } from './textureGenerator';
import { imageCache } from '../../services/imageCache';

interface BlankGarment3DProps {
  modelType?: string;
}

export const BlankGarment3D: React.FC<BlankGarment3DProps> = ({ modelType = 'tee-t5' }) => {
  const { material } = useMaterialStore();
  const { layers } = useDesignStore();
  const { settings } = useSceneStore();

  const [modelData, setModelData] = useState<BlankModelData | null>(null);
  const [normalTexture, setNormalTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [textureTrigger, setTextureTrigger] = useState(0);

  // Subscribe to imageCache so that when an uploaded graphic finishes loading, texture regenerates instantly
  useEffect(() => {
    const unsubscribe = imageCache.subscribe(() => {
      setTextureTrigger((c) => c + 1);
    });
    return unsubscribe;
  }, []);

  // Load 3D garment model binary and normal map
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const basePath = `/models/${modelType}`;
    loadBlankBuilderModel(`${basePath}/model.bin`, `${basePath}/normal.jpg`)
      .then((data) => {
        if (!active) return;
        setModelData(data);

        // Load normal map for realistic cotton jersey relief and cloth folds
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          data.normalMapUrl,
          (tex) => {
            if (!active) return;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(1, 1);
            tex.needsUpdate = true;
            setNormalTexture(tex);
            setIsLoading(false);
          },
          undefined,
          () => {
            // Normal map missing or fallback
            setIsLoading(false);
          }
        );
      })
      .catch((err) => {
        console.error('Error loading BlankBuilder model:', err);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [modelType]);

  // Generate dynamic 2048x2048 canvas texture with fabric color & artwork layers mapped to piece coordinates
  const garmentTexture = useMemo(() => {
    return createGarmentDynamicTexture(
      material,
      layers,
      modelData?.pieces,
      modelData?.pxPerCm || 16
    );
  }, [material.baseColor, material.pbr.roughness, layers, modelData, textureTrigger]);

  // High-Quality Cotton Jersey Material
  const shirtMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: garmentTexture,
      roughness: Math.max(0.65, material.pbr.roughness),
      metalness: 0.02,
      wireframe: settings.wireframe,
      side: THREE.DoubleSide,
    });

    if (normalTexture) {
      mat.normalMap = normalTexture;
      const relief = material.pbr.normalScale || 0.8;
      mat.normalScale = new THREE.Vector2(relief, relief);
    }

    return mat;
  }, [garmentTexture, normalTexture, material.pbr.roughness, material.pbr.normalScale, settings.wireframe]);

  // Seam Stitching Material
  const stitchMaterial = useMemo(() => {
    const threadColor = new THREE.Color(material.baseColor).offsetHSL(0, 0, -0.06);
    return new THREE.MeshStandardMaterial({
      color: threadColor,
      roughness: 0.8,
      metalness: 0.05,
    });
  }, [material.baseColor]);

  // Natural Timber Hanger Material
  const hangerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#9c6b3e',
      roughness: 0.35,
      metalness: 0.05,
    });
  }, []);

  // Chrome Metal Hook Material
  const hookMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.2,
      metalness: 0.85,
    });
  }, []);

  if (isLoading || !modelData) {
    return (
      <group position={[0, -2, 0]}>
        <mesh>
          <boxGeometry args={[35, 45, 8]} />
          <meshBasicMaterial color="#1e2330" wireframe />
        </mesh>
      </group>
    );
  }

  const showHanger = settings.avatarType === 'hanger' || settings.avatarType === 'mannequin';

  return (
    <group position={[0, -1, 0]}>
      {/* 1. Main Realistic Garment Cloth Mesh */}
      <mesh
        geometry={modelData.shirtGeometry}
        material={shirtMaterial}
        castShadow
        receiveShadow
      />

      {/* 2. Real 3D Seam Stitching Threads */}
      {modelData.stitchGeometry && settings.showSeamLines && (
        <mesh
          geometry={modelData.stitchGeometry}
          material={stitchMaterial}
          castShadow
        />
      )}

      {/* 3. Natural Timber Hanger (if available in model binary) */}
      {modelData.hangerGeometry && showHanger && (
        <mesh
          geometry={modelData.hangerGeometry}
          material={hangerMaterial}
          castShadow
        />
      )}

      {/* 4. Chrome Metal Hook */}
      {modelData.hookGeometry && showHanger && (
        <mesh
          geometry={modelData.hookGeometry}
          material={hookMaterial}
          castShadow
        />
      )}
    </group>
  );
};
