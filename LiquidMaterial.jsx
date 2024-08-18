// LiquidShader.js
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';

const LiquidMaterial = shaderMaterial(
  // Uniforms
  { uTime: 0, uMouse: [0, 0] },
  // Vertex Shader
  glsl`
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 10.0 + uTime) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    uniform vec2 uMouse;
    varying vec2 vUv;
    void main() {
      vec2 mouseDist = uMouse - vUv;
      float dist = length(mouseDist);
      float strength = 0.1 / dist;
      gl_FragColor = vec4(vec3(strength), 1.0);
    }
  `
);

extend({ LiquidMaterial });
