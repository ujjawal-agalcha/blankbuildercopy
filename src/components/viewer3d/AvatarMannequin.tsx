import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSceneStore } from '../../store/useSceneStore';

export const AvatarMannequin: React.FC = () => {
  const { settings } = useSceneStore();

  const mannequinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: settings.avatarColor || '#232732',
      roughness: 0.65,
      metalness: 0.15,
    });
  }, [settings.avatarColor]);

  const hangerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#c29b68', // Light maple wood
      roughness: 0.4,
      metalness: 0.05,
    });
  }, []);

  const metalHookMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.2,
      metalness: 0.85,
    });
  }, []);

  if (settings.avatarType === 'none' || !settings.avatarVisible) {
    return null;
  }

  if (settings.avatarType === 'hanger') {
    return (
      <group position={[0, 0.65, 0]}>
        {/* Wooden Hanger Bar */}
        <mesh material={hangerMaterial} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.52, 0.02, 0.02]} />
        </mesh>
        {/* Angled Shoulders */}
        <mesh material={hangerMaterial} position={[-0.18, -0.04, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.22, 0.018, 0.02]} />
        </mesh>
        <mesh material={hangerMaterial} position={[0.18, -0.04, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.22, 0.018, 0.02]} />
        </mesh>
        {/* Metal Swivel Hook */}
        <mesh material={metalHookMaterial} position={[0, 0.08, 0]}>
          <torusGeometry args={[0.04, 0.005, 12, 24, Math.PI * 1.5]} />
        </mesh>
      </group>
    );
  }

  // Full Fashion Studio Mannequin Form
  return (
    <group position={[0, 0.25, 0]}>
      {/* Head / Face Abstract Form */}
      <mesh material={mannequinMaterial} position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
      </mesh>

      {/* Neck */}
      <mesh material={mannequinMaterial} position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.12, 20]} />
      </mesh>

      {/* Shoulders & Upper Chest */}
      <mesh material={mannequinMaterial} position={[0, 0.42, 0]}>
        <boxGeometry args={[0.42, 0.16, 0.16]} />
      </mesh>

      {/* Chest / Ribcage */}
      <mesh material={mannequinMaterial} position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.14, 0.24, 24]} />
      </mesh>

      {/* Waist & Abdomen */}
      <mesh material={mannequinMaterial} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.155, 0.18, 24]} />
      </mesh>

      {/* Pelvis & Hips */}
      <mesh material={mannequinMaterial} position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.155, 0.14, 0.2, 24]} />
      </mesh>

      {/* Upper Arms */}
      <mesh material={mannequinMaterial} position={[-0.24, 0.32, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.045, 0.04, 0.28, 16]} />
      </mesh>
      <mesh material={mannequinMaterial} position={[0.24, 0.32, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.045, 0.04, 0.28, 16]} />
      </mesh>

      {/* Legs (Stylized Mannequin Stand) */}
      <mesh material={mannequinMaterial} position={[-0.09, -0.55, 0]}>
        <cylinderGeometry args={[0.065, 0.05, 0.65, 16]} />
      </mesh>
      <mesh material={mannequinMaterial} position={[0.09, -0.55, 0]}>
        <cylinderGeometry args={[0.065, 0.05, 0.65, 16]} />
      </mesh>

      {/* Studio Floor Stand Post & Base */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

