import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";


const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform float time;
uniform float glitchIntensity;
varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float glitch = step(0.8, rand(vec2(time * 0.5, vUv.y * 10.0))) * glitchIntensity;
  vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), glitch);
  gl_FragColor = vec4(color, 1.0);
}
`;

const GlitchMaterial = shaderMaterial(
  { time: 0, glitchIntensity: 0 },
  vertexShader,
  fragmentShader
);

extend({ GlitchMaterial });

export default GlitchMaterial;
