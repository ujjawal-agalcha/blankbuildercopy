import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGarmentStore } from '../../store/useGarmentStore';
import { useMaterialStore } from '../../store/useMaterialStore';
import { useDesignStore } from '../../store/useDesignStore';
import { useSceneStore } from '../../store/useSceneStore';
import { createGarmentDynamicTexture } from './textureGenerator';

export const GarmentMesh3D: React.FC = () => {
  const { measurements, template } = useGarmentStore();
  const { material } = useMaterialStore();
  const { layers } = useDesignStore();
  const { settings } = useSceneStore();

  // Dynamic texture containing fabric color + all artwork layers
  const garmentTexture = useMemo(() => {
    return createGarmentDynamicTexture(material, layers);
  }, [material.baseColor, material.pbr.roughness, layers]);

  // Scaled dimensions in 3D world units (1 unit = ~1000mm / 1 meter)
  const isPants = template.category === 'bottoms';
  const isHoodie = template.subcategory === 'Hoodie';

  const chestWidth = ((measurements.chestWidth || 560) / 1000) * 0.9;
  const bodyLength = (measurements.bodyLength || 720) / 1000;
  const shoulderWidth = ((measurements.shoulderWidth || 500) / 1000) * 0.9;
  const sleeveLength = (measurements.sleeveLength || 240) / 1000;
  const sleeveOpening = ((measurements.sleeveOpening || 180) / 1000) * 0.9;
  const neckWidth = (measurements.neckWidth || 190) / 1000;
  const collarHeight = (measurements.collarHeight || 25) / 1000;

  // Front & Back Curved Torso Geometry
  const frontTorsoGeo = useMemo(() => {
    // Curved plane simulating fabric draped over chest
    const geo = new THREE.PlaneGeometry(chestWidth, bodyLength, 32, 32);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Torso curvature: curve backward at the sides to wrap around body
      const normalizedX = x / (chestWidth / 2);
      const curveZ = -Math.pow(normalizedX, 2) * 0.08 + 0.06;
      pos.setZ(i, curveZ);

      // Shoulder taper towards top
      if (y > 0) {
        const factor = y / (bodyLength / 2);
        const taper = 1.0 - factor * (1.0 - shoulderWidth / chestWidth);
        pos.setX(i, x * taper);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, [chestWidth, bodyLength, shoulderWidth]);

  const backTorsoGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(chestWidth, bodyLength, 32, 32);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const normalizedX = x / (chestWidth / 2);
      const curveZ = Math.pow(normalizedX, 2) * 0.08 - 0.06;
      pos.setZ(i, curveZ);

      if (y > 0) {
        const factor = y / (bodyLength / 2);
        const taper = 1.0 - factor * (1.0 - shoulderWidth / chestWidth);
        pos.setX(i, x * taper);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, [chestWidth, bodyLength, shoulderWidth]);

  // Sleeve Cylinders
  const sleeveGeo = useMemo(() => {
    const topRadius = 0.12;
    const bottomRadius = sleeveOpening / 2;
    const geo = new THREE.CylinderGeometry(bottomRadius, topRadius, sleeveLength, 24, 8, true);
    geo.computeVertexNormals();
    return geo;
  }, [sleeveOpening, sleeveLength]);

  // Collar Ring / Rib Geometry
  const collarGeo = useMemo(() => {
    return new THREE.TorusGeometry(neckWidth * 0.52, collarHeight * 0.8, 16, 32);
  }, [neckWidth, collarHeight]);

  // Kangaroo Pocket Geometry (for Hoodie)
  const pocketGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.32, 0.2, 16, 16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const normX = x / 0.16;
      pos.setZ(i, (1 - normX * normX) * 0.035 + 0.07);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Shared Fabric PBR Material
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: garmentTexture,
      roughness: material.pbr.roughness,
      metalness: material.pbr.metallic,
      wireframe: settings.wireframe,
      side: THREE.DoubleSide,
    });
  }, [garmentTexture, material.pbr.roughness, material.pbr.metallic, settings.wireframe]);

  const seamLineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
  }, []);

  return (
    <group position={[0, 0.25, 0]}>
      {!isPants ? (
        /* ================= TOPS (T-Shirt, Hoodie, Sweatshirt) ================= */
        <group>
          {/* Front Body */}
          <mesh geometry={frontTorsoGeo} material={fabricMaterial} position={[0, 0, 0.05]} />

          {/* Back Body */}
          <mesh
            geometry={backTorsoGeo}
            material={fabricMaterial}
            position={[0, 0, -0.05]}
            rotation={[0, Math.PI, 0]}
          />

          {/* Left Sleeve */}
          <mesh
            geometry={sleeveGeo}
            material={fabricMaterial}
            position={[-shoulderWidth * 0.58, bodyLength * 0.32, 0]}
            rotation={[0, 0, 0.7]}
          />

          {/* Right Sleeve */}
          <mesh
            geometry={sleeveGeo}
            material={fabricMaterial}
            position={[shoulderWidth * 0.58, bodyLength * 0.32, 0]}
            rotation={[0, 0, -0.7]}
          />

          {/* Neck Collar Rib */}
          <mesh
            geometry={collarGeo}
            material={fabricMaterial}
            position={[0, bodyLength * 0.48, 0]}
            rotation={[Math.PI / 2.3, 0, 0]}
          />

          {/* Kangaroo Pocket if Hoodie */}
          {isHoodie && (
            <mesh geometry={pocketGeo} material={fabricMaterial} position={[0, -0.12, 0.09]} />
          )}

          {/* 3D Seam Line Highlights */}
          {settings.showSeamLines && (
            <group>
              {/* Shoulder Seams */}
              <lineSegments>
                <edgesGeometry args={[frontTorsoGeo]} />
                <lineBasicMaterial color="#10b981" />
              </lineSegments>
            </group>
          )}
        </group>
      ) : (
        /* ================= BOTTOMS (Pants, Jeans, Joggers) ================= */
        <group position={[0, -0.3, 0]}>
          {/* Left Leg */}
          <mesh material={fabricMaterial} position={[-0.14, -0.2, 0]}>
            <cylinderGeometry args={[0.13, 0.1, 0.95, 24, 16, true]} />
          </mesh>
          {/* Right Leg */}
          <mesh material={fabricMaterial} position={[0.14, -0.2, 0]}>
            <cylinderGeometry args={[0.13, 0.1, 0.95, 24, 16, true]} />
          </mesh>
          {/* Waistband */}
          <mesh material={fabricMaterial} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.04, 16, 32]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

