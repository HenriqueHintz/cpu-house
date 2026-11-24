'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CONDUIT_SPECS: Array<{
  from: [number, number, number];
  mid: [number, number, number];
  to: [number, number, number];
  speed: number;
  offset: number;
}> = [
  { from: [0, 0.75, 0], mid: [-0.85, 1.45, 0.3], to: [-1.65, 1.22, 0.4], speed: 0.36, offset: 0.0 },
  { from: [0, 0.85, 0], mid: [0.85, 1.5, -0.2], to: [1.65, 1.25, -0.3], speed: 0.42, offset: 0.28 },
  { from: [0, 0.2, 0.3], mid: [0.95, 0.3, 1.0], to: [1.45, -0.1, 1.28], speed: 0.33, offset: 0.55 },
  { from: [0, 0.2, -0.3], mid: [-0.95, 0.35, -0.95], to: [-1.45, -0.08, -1.25], speed: 0.38, offset: 0.78 },
];

function DataConduits() {
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);

  const conduits = useMemo(
    () =>
      CONDUIT_SPECS.map((spec) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(...spec.from),
          new THREE.Vector3(...spec.mid),
          new THREE.Vector3(...spec.to),
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.018, 8, false);
        return {
          curve,
          tubeGeo,
          speed: spec.speed,
          offset: spec.offset,
        };
      }),
    []
  );

  const tubeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4DA3C1',
        roughness: 0.35,
        metalness: 0.15,
        transparent: true,
        opacity: 0.72,
      }),
    []
  );

  const packetGeo = useMemo(() => new THREE.SphereGeometry(0.062, 16, 16), []);
  const packetMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#22B8CF',
      }),
    []
  );

  useEffect(() => {
    return () => {
      conduits.forEach((c) => c.tubeGeo.dispose());
      tubeMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
    };
  }, [conduits, tubeMat, packetGeo, packetMat]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    conduits.forEach((item, idx) => {
      const mesh = packetRefs.current[idx];
      if (!mesh) return;
      const u = (t * item.speed + item.offset) % 1;
      item.curve.getPointAt(u, tempVec);
      mesh.position.copy(tempVec);
    });
  });

  return (
    <group>
      {conduits.map((item, idx) => (
        <group key={idx}>
          <mesh geometry={item.tubeGeo} material={tubeMat} />
          <mesh
            ref={(el) => {
              packetRefs.current[idx] = el;
            }}
            geometry={packetGeo}
            material={packetMat}
          />
        </group>
      ))}
    </group>
  );
}

function ServerRackTower() {
  const ledRefs = useRef<Array<THREE.Mesh | null>>([]);
  const ledGeo = useMemo(() => new THREE.SphereGeometry(0.036, 12, 12), []);

  useEffect(() => {
    return () => {
      ledGeo.dispose();
    };
  }, [ledGeo]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ledRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const pulse = 0.55 + 0.45 * Math.sin(t * 2.6 + idx * 1.1);
      mat.emissiveIntensity = 0.8 + pulse * 1.4;
    });
  });

  return (
    <group position={[0, 0.42, 0]}>
      <RoundedBox args={[1.18, 2.05, 1.06]} radius={0.09} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#083E57" metalness={0.18} roughness={0.38} />
      </RoundedBox>

      <RoundedBox
        args={[1.22, 0.11, 1.1]}
        radius={0.03}
        smoothness={3}
        position={[0, 1.04, 0]}
      >
        <meshStandardMaterial color="#8FD3E6" metalness={0.1} roughness={0.3} />
      </RoundedBox>

      {[-0.62, -0.31, 0, 0.31, 0.62].map((yPos, idx) => (
        <group key={idx} position={[0, yPos, 0.535]}>
          <RoundedBox args={[0.9, 0.19, 0.045]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#041E2B" metalness={0.15} roughness={0.45} />
          </RoundedBox>
          <mesh
            ref={(el) => {
              ledRefs.current[idx] = el;
            }}
            geometry={ledGeo}
            position={[-0.33, 0, 0.032]}
          >
            <meshStandardMaterial
              color="#22B8CF"
              emissive="#22B8CF"
              emissiveIntensity={2.0}
              roughness={0.15}
            />
          </mesh>
          <RoundedBox args={[0.42, 0.04, 0.025]} radius={0.01} position={[0.09, 0, 0.028]}>
            <meshStandardMaterial color="#3AA3C2" roughness={0.35} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

function CloudBackupNode() {
  return (
    <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.3}>
      <group position={[-1.68, 1.24, 0.4]}>
        <RoundedBox args={[0.88, 0.3, 0.5]} radius={0.15} smoothness={4} castShadow>
          <meshStandardMaterial color="#FFFFFF" roughness={0.24} metalness={0.05} />
        </RoundedBox>
        <mesh position={[-0.16, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.22} metalness={0.05} />
        </mesh>
        <mesh position={[0.15, 0.16, 0]} castShadow>
          <sphereGeometry args={[0.19, 24, 24]} />
          <meshStandardMaterial color="#D9F0F7" roughness={0.25} metalness={0.05} />
        </mesh>
        <RoundedBox args={[0.24, 0.24, 0.09]} radius={0.05} position={[0, 0.02, 0.26]}>
          <meshStandardMaterial color="#0B4F6C" roughness={0.3} />
        </RoundedBox>
      </group>
    </Float>
  );
}

function SecurityShieldNode() {
  const shieldGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.44);
    shape.lineTo(0.36, 0.29);
    shape.lineTo(0.32, -0.07);
    shape.quadraticCurveTo(0.22, -0.35, 0, -0.48);
    shape.quadraticCurveTo(-0.22, -0.35, -0.32, -0.07);
    shape.lineTo(-0.36, 0.29);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
  }, []);

  useEffect(() => {
    return () => {
      shieldGeo.dispose();
    };
  }, [shieldGeo]);

  return (
    <Float speed={2.1} rotationIntensity={0.15} floatIntensity={0.32}>
      <group position={[1.68, 1.28, -0.3]} rotation={[0, -0.45, 0]}>
        <mesh geometry={shieldGeo} castShadow position={[0, 0, -0.07]}>
          <meshStandardMaterial color="#0B4F6C" metalness={0.25} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0.11]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial
            color="#22B8CF"
            emissive="#22B8CF"
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function SatelliteNodes() {
  const satellites: Array<{ pos: [number, number, number]; accent: string }> = [
    { pos: [1.46, -0.22, 1.28], accent: '#22B8CF' },
    { pos: [-1.46, -0.18, -1.25], accent: '#22B8CF' },
    { pos: [-1.32, -0.26, 1.2], accent: '#3F94B2' },
    { pos: [1.3, -0.26, -1.2], accent: '#3F94B2' },
  ];

  return (
    <group>
      {satellites.map((node, idx) => (
        <group key={idx} position={node.pos}>
          <RoundedBox args={[0.48, 0.38, 0.48]} radius={0.06} smoothness={3} castShadow receiveShadow>
            <meshStandardMaterial color="#FFFFFF" roughness={0.32} metalness={0.08} />
          </RoundedBox>
          <RoundedBox args={[0.5, 0.055, 0.5]} radius={0.02} position={[0, 0.19, 0]}>
            <meshStandardMaterial color={node.accent} roughness={0.28} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

function InfrastructureCluster({
  scrollProgress,
  onReady,
}: {
  scrollProgress: number;
  onReady?: () => void;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const announcedRef = useRef(false);

  useFrame((state) => {
    if (!announcedRef.current) {
      announcedRef.current = true;
      onReady?.();
    }
    if (!rootRef.current) return;
    const targetRotY = 0.22 + state.pointer.x * 0.26 + scrollProgress * 0.32;
    const targetRotX = 0.04 - state.pointer.y * 0.14;
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.07);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, 0.07);
  });

  return (
    <group ref={rootRef} rotation={[0.04, 0.22, 0]} position={[0, -0.22, 0]}>
      <RoundedBox
        args={[3.95, 0.2, 3.95]}
        radius={0.08}
        smoothness={4}
        position={[0, -0.56, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#AED8E8" roughness={0.42} metalness={0.08} />
      </RoundedBox>

      <RoundedBox
        args={[1.95, 0.11, 1.95]}
        radius={0.05}
        smoothness={3}
        position={[0, -0.44, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#7BC0D8" roughness={0.38} metalness={0.1} />
      </RoundedBox>

      <gridHelper args={[3.7, 8, '#3F94B2', '#89C8DE']} position={[0, -0.45, 0]} />

      <ServerRackTower />
      <CloudBackupNode />
      <SecurityShieldNode />
      <SatelliteNodes />
      <DataConduits />
    </group>
  );
}

export default function HeroCanvas3D({
  scrollProgress = 0,
  onReady,
}: {
  scrollProgress?: number;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [5.2, 3.9, 5.6], fov: 35 }}
      dpr={[1, 1.75]}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0.15, 0);
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <ambientLight intensity={0.78} color="#EAF6FB" />
      <directionalLight
        position={[5, 9, 6]}
        intensity={1.35}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#22B8CF" />
      <InfrastructureCluster scrollProgress={scrollProgress} onReady={onReady} />
    </Canvas>
  );
}
