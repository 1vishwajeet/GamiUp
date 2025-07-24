import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Floating geometric shapes component
const FloatingGeometry = ({ position, geometry, color, speed = 1 }: {
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  color: string;
  speed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.007 * speed;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={geometry} />
      <meshPhongMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
};

// Particle system component
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, geometry } = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    return { positions, geometry: geo };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <primitive object={geometry} />
      <pointsMaterial size={0.05} color="#8B5CF6" transparent opacity={0.6} />
    </points>
  );
};

// Floating orbs component (replacing grid lines)
const FloatingOrbs = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.001;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 5,
            (Math.random() - 0.5) * 4,
            Math.sin((i / 8) * Math.PI * 2) * 5
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshPhongMaterial 
            color={i % 2 === 0 ? "#3B82F6" : "#8B5CF6"} 
            transparent 
            opacity={0.4} 
            emissive={i % 2 === 0 ? "#3B82F6" : "#8B5CF6"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main scene component
const Scene = () => {
  // Create different geometries
  const geometries = useMemo(() => [
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.OctahedronGeometry(0.3),
    new THREE.TetrahedronGeometry(0.4),
    new THREE.IcosahedronGeometry(0.3),
  ], []);

  const colors = ['#8B5CF6', '#3B82F6', '#06B6D4', '#10B981'];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#8B5CF6" />

      {/* Floating geometric shapes */}
      {Array.from({ length: 12 }, (_, i) => (
        <FloatingGeometry
          key={i}
          position={[
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 8
          ]}
          geometry={geometries[i % geometries.length]}
          color={colors[i % colors.length]}
          speed={0.5 + Math.random() * 1.5}
        />
      ))}

      {/* Particle field */}
      <ParticleField />

      {/* Floating orbs */}
      <FloatingOrbs />
    </>
  );
};

const GamingBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default GamingBackground;