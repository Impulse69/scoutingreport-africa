"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const HUBS = [
  { lat: 6.5244, lon: 3.3792, signal: 1.0 },    // Lagos
  { lat: 30.0444, lon: 31.2357, signal: 0.86 }, // Cairo
  { lat: -26.2041, lon: 28.0473, signal: 0.78 },// Johannesburg
  { lat: 33.5731, lon: -7.5898, signal: 0.68 }, // Casablanca
  { lat: -1.2921, lon: 36.8219, signal: 0.94 }, // Nairobi
  { lat: 14.7167, lon: -17.4677, signal: 0.72 },// Dakar
  { lat: 9.0054, lon: 38.7636, signal: 0.82 },  // Addis Ababa
  { lat: -33.9249, lon: 18.4241, signal: 0.64 },// Cape Town
  { lat: 0.3476, lon: 32.5825, signal: 0.88 },  // Kampala
  { lat: 5.6037, lon: -0.187, signal: 0.74 },   // Accra
];

const RADIUS = 3.5;

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getSize = () => {
      const w = mount.clientWidth || 600;
      const h = mount.clientHeight || 600;
      return { w, h };
    };

    const { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 10.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.x = 0.18;
    group.rotation.z = -0.06;
    scene.add(group);

    // Core sphere — deep matte charcoal
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 96),
      new THREE.MeshStandardMaterial({
        color: 0x080808,
        roughness: 0.9,
        metalness: 0.15,
      })
    );
    group.add(core);

    // Subtle wireframe graticule
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS + 0.004, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        wireframe: true,
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending,
      })
    );
    group.add(wire);

    // Continents — use the BINARY land/water mask (earth-water.png), but
    // INVERT it via a canvas so white = LAND and black = water. That puts
    // orange on continents and lets the dark core sphere read as ocean.
    // AlphaTest snaps fractional pixels off for pixel-crisp coastlines.
    let continents: THREE.Mesh | null = null;
    let coastline: THREE.Mesh | null = null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, cv.width, cv.height);
      // Invert RGB so land (originally black) becomes white = visible.
      for (let i = 0; i < data.data.length; i += 4) {
        data.data[i] = 255 - data.data[i];
        data.data[i + 1] = 255 - data.data[i + 1];
        data.data[i + 2] = 255 - data.data[i + 2];
      }
      ctx.putImageData(data, 0, 0);

      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;

      continents = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS + 0.012, 128, 128),
        new THREE.MeshBasicMaterial({
          color: 0xf97316,
          alphaMap: tex,
          transparent: true,
          opacity: 1,
          alphaTest: 0.5,
          depthWrite: false,
        })
      );
      group.add(continents);

      coastline = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS + 0.02, 128, 128),
        new THREE.MeshBasicMaterial({
          color: 0xfde68a,
          alphaMap: tex,
          transparent: true,
          opacity: 0.18,
          alphaTest: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      group.add(coastline);
    };
    img.src = "https://unpkg.com/three-globe/example/img/earth-water.png";

    // Soft outer atmosphere
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS + 0.45, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.045,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      })
    );
    group.add(atmo);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xf97316, 1.8);
    key.position.set(8, 4, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x0ea5e9, 1.1);
    rim.position.set(-8, -3, 6);
    scene.add(rim);

    // Hub markers
    type Hub = {
      dot: THREE.Mesh;
      halo: THREE.Mesh;
      haloMat: THREE.MeshBasicMaterial;
      signal: number;
    };
    const hubs: Hub[] = HUBS.map((h, i) => {
      const pos = latLonToVec3(h.lat, h.lon, RADIUS + 0.02);
      const isPrimary = i % 3 !== 0;
      const color = isPrimary ? 0xf97316 : 0x0ea5e9;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      dot.position.copy(pos);
      group.add(dot);

      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), haloMat);
      halo.position.copy(pos);
      group.add(halo);

      return { dot, halo, haloMat, signal: h.signal };
    });

    // Arc routes between selected hubs
    const ARC_PAIRS: [number, number][] = [
      [0, 1], [0, 4], [3, 5], [4, 6], [9, 0], [1, 6], [3, 1], [0, 2],
    ];
    ARC_PAIRS.forEach(([a, b], i) => {
      const start = latLonToVec3(HUBS[a].lat, HUBS[a].lon, RADIUS + 0.02);
      const end = latLonToVec3(HUBS[b].lat, HUBS[b].lon, RADIUS + 0.02);
      const distance = start.distanceTo(end);
      const mid = start
        .clone()
        .add(end)
        .normalize()
        .multiplyScalar(RADIUS + distance * 0.28);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      const mat = new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? 0x0ea5e9 : 0xf97316,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Line(geo, mat));
    });

    // Orbiting rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS + 0.85, 0.005, 16, 128),
      new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    );
    ring1.rotation.set(1.2, 0.5, 0);
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS + 1.25, 0.005, 16, 128),
      new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      })
    );
    ring2.rotation.set(-0.8, -0.3, 0);
    scene.add(ring2);

    // Animation loop
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;

      group.rotation.y = t * 0.18; // continuous slow spin
      ring1.rotation.z = t * 0.25;
      ring2.rotation.z = -t * 0.18;

      const pulse = 0.5 + Math.sin(t * 2.4) * 0.5;
      hubs.forEach((h) => {
        const s = 1 + pulse * 0.6 * h.signal;
        h.halo.scale.setScalar(s);
        h.haloMat.opacity = 0.18 + pulse * 0.22;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Responsive
    const ro = new ResizeObserver(() => {
      const { w: nw, h: nh } = getSize();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
          o.geometry.dispose();
          const mat = (o as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
