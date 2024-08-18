// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

// const ANIMATION_CONFIG = {
//   transitionSpeed: 0.03,
//   baseIntensity: 0.005,
//   hoverIntensity: 0.009,
// };

// const vertexShader = `
//     varying vec2 vUv;
//     void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fragmentShader = `
//     uniform float u_time;
//     uniform vec2 u_mouse;
//     uniform float u_intensity;
//     uniform sampler2D u_texture;
//     varying vec2 vUv;

//     void main() {
//         vec2 uv = vUv;
//         float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 5.0) * u_intensity;
//         float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 4.0) * u_intensity;
//         float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 3.0) * u_intensity;
//         float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 3.5) * u_intensity;

//         uv.y += wave1 + wave2;
//         uv.x += wave3 + wave4;
        
//         gl_FragColor = texture2D(u_texture, uv);
//     }
// `;

// const WavyText = ({ text }) => {
//   const canvasRef = useRef(null);
//   let scene, camera, renderer, planeMesh;
//   let currentState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };
//   let targetState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };

//   useEffect(() => {
//     const textCanvas = document.createElement("canvas");
//     const ctx = textCanvas.getContext("2d");

//     // Set canvas size
//     textCanvas.width = window.innerWidth;
//     textCanvas.height = window.innerHeight;

//     // Draw text
//     ctx.fillStyle = "#000"; // Text color
//     ctx.font = "30vw Arial"; // Font size and family
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

//     const texture = new THREE.CanvasTexture(textCanvas);

//     // Scene setup
//     camera = new THREE.PerspectiveCamera(
//       80,
//       canvasRef.current.offsetWidth / canvasRef.current.offsetHeight,
//       0.01,
//       10
//     );
//     camera.position.z = 1;

//     scene = new THREE.Scene();

//     const shaderUniforms = {
//       u_time: { type: "f", value: 1.0 },
//       u_mouse: { type: "v2", value: new THREE.Vector2() },
//       u_intensity: { type: "f", value: currentState.waveIntensity },
//       u_texture: { type: "t", value: texture },
//     };

//     planeMesh = new THREE.Mesh(
//       new THREE.PlaneGeometry(2, 2),
//       new THREE.ShaderMaterial({
//         uniforms: shaderUniforms,
//         vertexShader,
//         fragmentShader,
//       })
//     );

//     scene.add(planeMesh);

//     renderer = new THREE.WebGLRenderer();
//     renderer.setSize(
//       canvasRef.current.offsetWidth,
//       canvasRef.current.offsetHeight
//     );
//     canvasRef.current.appendChild(renderer.domElement);

//     canvasRef.current.addEventListener("mousemove", handleMouseMove, false);
//     animateScene();

//     function animateScene() {
//       requestAnimationFrame(animateScene);

//       currentState.mousePosition.x = updateValue(
//         targetState.mousePosition.x,
//         currentState.mousePosition.x,
//         ANIMATION_CONFIG.transitionSpeed
//       );
//       currentState.mousePosition.y = updateValue(
//         targetState.mousePosition.y,
//         currentState.mousePosition.y,
//         ANIMATION_CONFIG.transitionSpeed
//       );
//       currentState.waveIntensity = updateValue(
//         targetState.waveIntensity,
//         currentState.waveIntensity,
//         ANIMATION_CONFIG.transitionSpeed
//       );

//       const uniforms = planeMesh.material.uniforms;
//       uniforms.u_intensity.value = currentState.waveIntensity;
//       uniforms.u_time.value += 0.005;
//       uniforms.u_mouse.value.set(
//         currentState.mousePosition.x,
//         currentState.mousePosition.y
//       );

//       renderer.render(scene, camera);
//     }

//     function updateValue(targetState, current, transitionSpeed) {
//       return current + (targetState - current) * transitionSpeed;
//     }

//     function handleMouseMove(event) {
//       const rect = canvasRef.current.getBoundingClientRect();
//       targetState.mousePosition.x =
//         ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       targetState.mousePosition.y =
//         -((event.clientY - rect.top) / rect.height) * 2 + 1;
//     }

//     canvasRef.current.addEventListener("mouseover", () => {
//       targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
//     });

//     canvasRef.current.addEventListener("mouseout", () => {
//       targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
//       targetState.mousePosition = { x: 0, y: 0 };
//     });

//     return () => {
//       canvasRef.current.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, [text]);

//   return (
//     <div className="relative w-full h-full flex justify-center items-center">
//       <div
//         ref={canvasRef}
//         className="w-full h-full rounded-lg border border-gray-800 overflow-hidden shadow-lg transition-transform duration-500 hover:scale-105"
//       ></div>
//     </div>
//   );
// };

// export default WavyText;


import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ANIMATION_CONFIG = {
  transitionSpeed: 0.03,
  baseIntensity: 0.005,
  hoverIntensity: 0.009,
};

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_scroll;
    uniform float u_intensity;
    uniform sampler2D u_texture;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_scroll.x * 5.0) * u_intensity ;
        float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_scroll.y * 4.0) * u_intensity ;
        float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_scroll.x * 3.0) * u_intensity ;
        float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_scroll.y * 3.5) * u_intensity ;

        uv.y += wave1 + wave2;
        uv.x += wave3 + wave4;
        
        gl_FragColor = texture2D(u_texture, uv);
    }
`;

const WavyText = ({ text }) => {
  const canvasRef = useRef(null);
  let scene, camera, renderer, planeMesh;
  let currentState = { scrollPosition: { x: 0, y: 0 }, waveIntensity: 0.005 };
  let targetState = { scrollPosition: { x: 0, y: 0 }, waveIntensity: 0.005 };

  useEffect(() => {
    const textCanvas = document.createElement("canvas");
    const ctx = textCanvas.getContext("2d");

    // Set canvas size
    textCanvas.width = window.innerWidth;
    textCanvas.height = window.innerHeight;

    // Draw text
    ctx.fillStyle = "#000"; // Text color
    ctx.font = "10vw Arial"; // Font size and family
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

    const texture = new THREE.CanvasTexture(textCanvas);

    // Scene setup
    camera = new THREE.PerspectiveCamera(
      80,
      canvasRef.current.offsetWidth / canvasRef.current.offsetHeight,
      0.01,
      10
    );
    camera.position.z = 1;

    scene = new THREE.Scene();

    const shaderUniforms = {
      u_time: { type: "f", value: 1.0 },
      u_scroll: { type: "v2", value: new THREE.Vector2() },
      u_intensity: { type: "f", value: currentState.waveIntensity },
      u_texture: { type: "t", value: texture },
    };

    planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
      })
    );

    scene.add(planeMesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      canvasRef.current.offsetWidth,
      canvasRef.current.offsetHeight
    );
    canvasRef.current.appendChild(renderer.domElement);

    window.addEventListener("scroll", handleScroll, false);
    animateScene();

    function animateScene() {
      requestAnimationFrame(animateScene);

      currentState.scrollPosition.x = updateValue(
        targetState.scrollPosition.x,
        currentState.scrollPosition.x,
        ANIMATION_CONFIG.transitionSpeed
      );
      currentState.scrollPosition.y = updateValue(
        targetState.scrollPosition.y,
        currentState.scrollPosition.y,
        ANIMATION_CONFIG.transitionSpeed
      );
      currentState.waveIntensity = updateValue(
        targetState.waveIntensity,
        currentState.waveIntensity,
        ANIMATION_CONFIG.transitionSpeed
      );

      const uniforms = planeMesh.material.uniforms;
      uniforms.u_intensity.value = currentState.waveIntensity;
      uniforms.u_time.value += 0.005;
      uniforms.u_scroll.value.set(
        currentState.scrollPosition.x,
        currentState.scrollPosition.y
      );

      renderer.render(scene, camera);
    }

    function updateValue(targetState, current, transitionSpeed) {
      return current + (targetState - current) * transitionSpeed;
    }

    function handleScroll() {
      const scrollTop = window.scrollY || window.pageYOffset;
      targetState.scrollPosition.y = scrollTop * 0.01; 
      targetState.scrollPosition.x = scrollTop * 0.01; 
    }

    canvasRef.current.addEventListener("mouseover", () => {
      targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
    });

    canvasRef.current.addEventListener("mouseout", () => {
      targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
      targetState.scrollPosition = { x: 0, y: 0 };
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [text]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div
        ref={canvasRef}
        className="w-full h-full rounded-lg border border-gray-800 overflow-hidden shadow-lg transition-transform duration-500 "
      ></div>
    </div>
  );
};

export default WavyText;
