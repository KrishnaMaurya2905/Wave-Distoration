// LiquidEffect.js
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import LiquidShader from './LiquidShader';
import { useSpring, a } from '@react-spring/three';

const Float = () => {
  const meshRef = useRef();
  const { size, viewport } = useThree();

  useFrame(({ clock, mouse }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      meshRef.current.material.uniforms.uMouse.value = [mouse.x, mouse.y];
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <liquidMaterial attach="material" />
    </mesh>
  );
};

const LiquidCanvas = () => {
  return (
    <Canvas>
      <Float />
    </Canvas>
  );
};

export default LiquidCanvas;
