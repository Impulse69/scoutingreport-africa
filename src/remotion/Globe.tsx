"use client";

import React, { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const AFRICAN_HUBS = [
  { lat: 6.5244, lon: 3.3792, name: "Lagos" },
  { lat: 30.0444, lon: 31.2357, name: "Cairo" },
  { lat: -26.2041, lon: 28.0473, name: "Johannesburg" },
  { lat: 33.5731, lon: -7.5898, name: "Casablanca" },
  { lat: -1.2921, lon: 36.8219, name: "Nairobi" },
  { lat: 14.7167, lon: -17.4677, name: "Dakar" },
  { lat: 9.0054, lon: 38.7636, name: "Addis Ababa" },
  { lat: -33.9249, lon: 18.4241, name: "Cape Town" },
  { lat: 0.3476, lon: 32.5825, name: "Kampala" },
  { lat: 5.6037, lon: -0.1870, name: "Accra" },
];

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Slow, elegant rotation
  const rotationY = (frame / durationInFrames) * Math.PI * 2;
  
  // Slight tilt to show Africa better
  const tiltX = 0.2;

  const points = useMemo(() => {
    return AFRICAN_HUBS.map(hub => latLonToVector3(hub.lat, hub.lon, 3.05));
  }, []);

  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fed7aa" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e7e5e4" />
      
      <group rotation={[tiltX, rotationY, 0]}>
        {/* Main Sphere */}
        <mesh>
          <sphereGeometry args={[3, 64, 64]} />
          <meshStandardMaterial
            color="#fcfcfb" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Wireframe Overlay */}
        <mesh>
          <sphereGeometry args={[3.01, 32, 32]} />
          <meshBasicMaterial
            color="#f5f5f4"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* African Hubs (Markers) */}
        {points.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#ea580c" />
            <pointLight distance={1} intensity={2} color="#ea580c" />
          </mesh>
        ))}

        {/* Africa Highlight (Conceptual) */}
        <mesh rotation={[0, -Math.PI / 2.5, 0]}>
          <sphereGeometry args={[3.02, 64, 64, 0, Math.PI / 2, Math.PI / 4, Math.PI / 2]} />
          <meshBasicMaterial 
            color="#ffedd5" 
            transparent 
            opacity={0.05} 
          />
        </mesh>
      </group>

      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial
          color="#fed7aa"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </ThreeCanvas>
  );
};

export default Globe;
