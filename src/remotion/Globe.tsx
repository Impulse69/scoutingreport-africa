"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const AFRICAN_HUBS = [
  { lat: 6.5244, lon: 3.3792, name: "Lagos", signal: 1 },
  { lat: 30.0444, lon: 31.2357, name: "Cairo", signal: 0.86 },
  { lat: -26.2041, lon: 28.0473, name: "Johannesburg", signal: 0.78 },
  { lat: 33.5731, lon: -7.5898, name: "Casablanca", signal: 0.68 },
  { lat: -1.2921, lon: 36.8219, name: "Nairobi", signal: 0.94 },
  { lat: 14.7167, lon: -17.4677, name: "Dakar", signal: 0.72 },
  { lat: 9.0054, lon: 38.7636, name: "Addis Ababa", signal: 0.82 },
  { lat: -33.9249, lon: 18.4241, name: "Cape Town", signal: 0.64 },
  { lat: 0.3476, lon: 32.5825, name: "Kampala", signal: 0.88 },
  { lat: 5.6037, lon: -0.187, name: "Accra", signal: 0.74 },
];

const ROUTES = [
  { from: 0, to: 1 },
  { from: 0, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 6 },
  { from: 2, to: 7 },
  { from: 9, to: 0 },
  { from: 1, to: 6 },
  { from: 0, to: 2 },
  { from: 3, to: 1 },
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

const GLOBE_RADIUS = 3.5;

const Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const [earthMap, setEarthMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Load a high-res topology map for the continents
    new THREE.TextureLoader().load(
      "https://unpkg.com/three-globe/example/img/earth-topology.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        setEarthMap(texture);
      }
    );
  }, []);

  // Smooth continuous rotation
  const rotationY = Math.PI * 0.8 + (frame / durationInFrames) * Math.PI * 2;
  const pulse = 0.5 + Math.sin(frame / 15) * 0.5;
  
  // Tilt globe slightly to show Africa better
  const tiltX = 0.15;
  const tiltZ = -0.1;

  const points = useMemo(() => {
    return AFRICAN_HUBS.map((hub) => latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS + 0.02));
  }, []);

  const routes = useMemo(() => {
    return ROUTES.map((route) => {
      const start = points[route.from];
      const end = points[route.to];
      // Create an arc for the route
      const distance = start.distanceTo(end);
      const mid = start.clone().add(end).normalize().multiplyScalar(GLOBE_RADIUS + distance * 0.25);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return curve.getPoints(40);
    });
  }, [points]);

  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 10.5], fov: 45 }}>
      <fog attach="fog" args={["#0A0A0A", 10, 20]} />
      <ambientLight intensity={0.5} />
      {/* Dramatic lighting */}
      <directionalLight position={[10, 5, 10]} intensity={2} color="#F97316" />
      <directionalLight position={[-10, -5, 10]} intensity={1.5} color="#0EA5E9" />
      
      <group rotation={[tiltX, rotationY, tiltZ]}>
        
        {/* Core solid sphere */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshStandardMaterial
            color="#050505"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Dense wireframe for tech aesthetic */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS + 0.005, 48, 48]} />
          <meshBasicMaterial
            color="#F97316"
            wireframe
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* High-res mapped continents */}
        {earthMap && (
          <mesh>
            <sphereGeometry args={[GLOBE_RADIUS + 0.01, 64, 64]} />
            <meshBasicMaterial
              map={earthMap}
              color="#F97316"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Data routes/arcs */}
        {routes.map((route, i) => (
          <line key={i}>
            <bufferGeometry attach="geometry" setFromPoints={route} />
            <lineBasicMaterial
              attach="material"
              color={i % 3 === 0 ? "#0EA5E9" : "#F97316"}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </line>
        ))}

        {/* Hub points with pulsing halos */}
        {points.map((pos, i) => {
          const signal = AFRICAN_HUBS[i].signal;
          const markerScale = 0.04 + pulse * 0.02 * signal;
          const isPrimary = i % 2 === 0;
          const color = isPrimary ? "#F97316" : "#0EA5E9";

          return (
            <group key={AFRICAN_HUBS[i].name} position={pos}>
              {/* Core dot */}
              <mesh scale={markerScale}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
              {/* Pulsing halo */}
              <mesh scale={markerScale * 4}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial 
                  color={color} 
                  transparent 
                  opacity={0.15 + pulse * 0.15} 
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          );
        })}

        {/* Outer glowing atmosphere */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS + 0.3, 64, 64]} />
          <meshBasicMaterial
            color="#F97316"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Orbiting data rings */}
      <mesh rotation={[1.2, 0.5, frame * 0.01]}>
        <torusGeometry args={[GLOBE_RADIUS + 0.8, 0.005, 16, 100]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[-0.8, -0.3, frame * -0.015]}>
        <torusGeometry args={[GLOBE_RADIUS + 1.2, 0.005, 16, 100]} />
        <meshBasicMaterial color="#F97316" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
    </ThreeCanvas>
  );
};

export default Globe;
