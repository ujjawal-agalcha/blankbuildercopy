import React from 'react';
import { useSceneStore } from '../../store/useSceneStore';
import { ContactShadows } from '@react-three/drei';

export const StudioLighting: React.FC = () => {
  const { settings } = useSceneStore();
  const { lightingPreset, lightIntensity } = settings;

  switch (lightingPreset) {
    case 'warm-editorial':
      return (
        <>
          <ambientLight intensity={0.45 * lightIntensity} />
          {/* Warm Key Light */}
          <directionalLight
            position={[3, 4, 3]}
            intensity={1.4 * lightIntensity}
            color="#ffedd5"
            castShadow
          />
          {/* Golden Fill */}
          <directionalLight
            position={[-3, 2, -2]}
            intensity={0.6 * lightIntensity}
            color="#fed7aa"
          />
          {/* Subtle Blue Rim */}
          <pointLight position={[0, 4, -4]} intensity={0.8 * lightIntensity} color="#93c5fd" />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.65} scale={8} blur={2.4} far={4} />
        </>
      );

    case 'dramatic-rim':
      return (
        <>
          <ambientLight intensity={0.2 * lightIntensity} />
          {/* Sharp White Rim Backlight */}
          <directionalLight
            position={[0, 3, -4]}
            intensity={2.2 * lightIntensity}
            color="#ffffff"
          />
          {/* Subdued Key Light */}
          <directionalLight
            position={[2, 3, 3]}
            intensity={0.8 * lightIntensity}
            color="#e2e8f0"
          />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.8} scale={8} blur={1.8} far={4} />
        </>
      );

    case 'cyberpunk-neon':
      return (
        <>
          <ambientLight intensity={0.25 * lightIntensity} />
          {/* Hot Magenta Key */}
          <directionalLight
            position={[3, 3, 2]}
            intensity={1.6 * lightIntensity}
            color="#ec4899"
          />
          {/* Electric Cyan Fill */}
          <directionalLight
            position={[-3, 2, 2]}
            intensity={1.4 * lightIntensity}
            color="#06b6d4"
          />
          {/* Emerald Rim */}
          <pointLight position={[0, 4, -3]} intensity={1.8 * lightIntensity} color="#10b981" />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.7} scale={8} blur={2} far={4} />
        </>
      );

    case 'studio-clean':
    default:
      return (
        <>
          <ambientLight intensity={0.6 * lightIntensity} />
          {/* Main Key Light */}
          <directionalLight
            position={[4, 5, 4]}
            intensity={1.2 * lightIntensity}
            color="#ffffff"
            castShadow
          />
          {/* Soft Fill Light */}
          <directionalLight
            position={[-4, 3, 2]}
            intensity={0.65 * lightIntensity}
            color="#f1f5f9"
          />
          {/* Back Light */}
          <directionalLight
            position={[0, 3, -4]}
            intensity={0.7 * lightIntensity}
            color="#e2e8f0"
          />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.55} scale={8} blur={2.2} far={4} />
        </>
      );
  }
};

