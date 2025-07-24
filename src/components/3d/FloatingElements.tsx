import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

const FloatingElement = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.1, 16, 16]}>
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </Sphere>
  );
};

const FloatingElements = () => {
  const elements = [
    { position: [-2, 1, -1] as [number, number, number], color: "#a855f7", speed: 0.01 },
    { position: [2, -1, -2] as [number, number, number], color: "#3b82f6", speed: 0.015 },
    { position: [0, 2, -1.5] as [number, number, number], color: "#06b6d4", speed: 0.008 },
    { position: [-1.5, -2, -1] as [number, number, number], color: "#10b981", speed: 0.012 },
    { position: [1.5, 0, -2.5] as [number, number, number], color: "#f59e0b", speed: 0.009 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {elements.map((element, index) => (
        <FloatingElement
          key={index}
          position={element.position}
          color={element.color}
          speed={element.speed}
        />
      ))}
    </>
  );
};

export default FloatingElements;