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
          <ambientLight intensity={0.45 * lightIntensity} color="#fff7ed" />
          {/* Warm Key Light */}
          <directionalLight
            position={[45, 75, 70]}
            intensity={1.4 * lightIntensity}
            color="#ffedd5"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          {/* Golden Fill */}
          <directionalLight
            position={[-50, 30, 40]}
            intensity={0.65 * lightIntensity}
            color="#fed7aa"
          />
          {/* Subtle Cool Rim */}
          <directionalLight
            position={[0, 60, -70]}
            intensity={0.9 * lightIntensity}
            color="#bfdbfe"
          />
          <ContactShadows
            position={[0, -42, 0]}
            opacity={0.65}
            scale={120}
            blur={2.5}
            far={60}
          />
        </>
      );

    case 'dramatic-rim':
      return (
        <>
          <ambientLight intensity={0.25 * lightIntensity} />
          {/* Strong Rim Backlight */}
          <directionalLight
            position={[0, 60, -80]}
            intensity={2.4 * lightIntensity}
            color="#ffffff"
          />
          {/* Soft Key */}
          <directionalLight
            position={[35, 55, 65]}
            intensity={0.85 * lightIntensity}
            color="#e2e8f0"
          />
          <ContactShadows
            position={[0, -42, 0]}
            opacity={0.8}
            scale={120}
            blur={2.0}
            far={60}
          />
        </>
      );

    case 'cyberpunk-neon':
      return (
        <>
          <ambientLight intensity={0.3 * lightIntensity} />
          {/* Hot Magenta Key */}
          <directionalLight
            position={[45, 60, 60]}
            intensity={1.8 * lightIntensity}
            color="#ec4899"
          />
          {/* Cyan Fill */}
          <directionalLight
            position={[-45, 40, 50]}
            intensity={1.6 * lightIntensity}
            color="#06b6d4"
          />
          {/* Rim light */}
          <pointLight position={[0, 70, -60]} intensity={2.0 * lightIntensity} color="#10b981" />
          <ContactShadows
            position={[0, -42, 0]}
            opacity={0.7}
            scale={120}
            blur={2.2}
            far={60}
          />
        </>
      );

    case 'studio-clean':
    default:
      return (
        <>
          <ambientLight intensity={0.65 * lightIntensity} color="#ffffff" />
          {/* Primary Studio Key Light */}
          <directionalLight
            position={[40, 80, 80]}
            intensity={1.25 * lightIntensity}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          {/* Soft Fill Light */}
          <directionalLight
            position={[-45, 50, 50]}
            intensity={0.6 * lightIntensity}
            color="#f8fafc"
          />
          {/* Subtle Back Rim Light */}
          <directionalLight
            position={[0, 60, -75]}
            intensity={0.75 * lightIntensity}
            color="#ffffff"
          />
          <ContactShadows
            position={[0, -42, 0]}
            opacity={0.55}
            scale={120}
            blur={2.4}
            far={60}
          />
        </>
      );
  }
};
