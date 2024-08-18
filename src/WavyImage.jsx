

// // // import React, { useEffect, useRef } from "react";
// // // import * as THREE from "three";

// // // const ANIMATION_CONFIG = {
// // //   transitionSpeed: 0.03,
// // //   baseIntensity: 0.005,
// // //   hoverIntensity: 0.009,
// // // };

// // // // Shaders
// // // const vertexShader = `
// // //     varying vec2 vUv;
// // //     void main() {
// // //         vUv = uv;
// // //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// // //     }
// // // `;

// // // const fragmentShader = `
// // //     uniform float u_time;
// // //     uniform vec2 u_mouse;
// // //     uniform float u_intensity;
// // //     uniform sampler2D u_texture;
// // //     varying vec2 vUv;

// // //     void main() {
// // //         vec2 uv = vUv;
// // //         float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 5.0) * u_intensity;
// // //         float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 4.0) * u_intensity;
// // //         float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 3.0) * u_intensity;
// // //         float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 3.5) * u_intensity;

// // //         uv.y += wave1 + wave2;
// // //         uv.x += wave3 + wave4;
        
// // //         gl_FragColor = texture2D(u_texture, uv);
// // //     }
// // // `;

// // // const WavyImage = ({ src }) => {
// // //   const canvasRef = useRef(null);
// // //   let scene, camera, renderer, planeMesh;
// // //   let currentState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };
// // //   let targetState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };

// // //   useEffect(() => {
// // //     const textureLoader = new THREE.TextureLoader();
// // //     const texture = textureLoader.load(src, initializeScene);

// // //     function initializeScene(texture) {
// // //       camera = new THREE.PerspectiveCamera(
// // //         80,
// // //         canvasRef.current.offsetWidth / canvasRef.current.offsetHeight,
// // //         0.01,
// // //         10
// // //       );
// // //       camera.position.z = 1;

// // //       scene = new THREE.Scene();

// // //       const shaderUniforms = {
// // //         u_time: { type: "f", value: 1.0 },
// // //         u_mouse: { type: "v2", value: new THREE.Vector2() },
// // //         u_intensity: { type: "f", value: currentState.waveIntensity },
// // //         u_texture: { type: "t", value: texture },
// // //       };

// // //       planeMesh = new THREE.Mesh(
// // //         new THREE.PlaneGeometry(2, 2),
        
// // //         new THREE.ShaderMaterial({
// // //           uniforms: shaderUniforms,
// // //           vertexShader,
// // //           fragmentShader,
// // //           // wireframe: true,
// // //         })
// // //       );

// // //       scene.add(planeMesh);

// // //       renderer = new THREE.WebGLRenderer();
// // //       renderer.setSize(
// // //         canvasRef.current.offsetWidth,
// // //         canvasRef.current.offsetHeight
// // //       );
// // //       canvasRef.current.appendChild(renderer.domElement);

// // //       window.addEventListener("resize", onWindowResize, false);
// // //       canvasRef.current.addEventListener("mousemove", handleMouseMove, false);
// // //       canvasRef.current.addEventListener("touchstart", handleTouchStart, false);
// // //       canvasRef.current.addEventListener("touchmove", handleTouchMove, false);
// // //       canvasRef.current.addEventListener("touchend", handleTouchEnd, false);
// // //       animateScene();
// // //     }

// // //     function onWindowResize() {
// // //       camera.aspect = canvasRef.current.offsetWidth / canvasRef.current.offsetHeight;
// // //       camera.updateProjectionMatrix();
// // //       renderer.setSize(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
// // //     }

// // //     function animateScene() {
// // //       requestAnimationFrame(animateScene);

// // //       currentState.mousePosition.x = updateValue(
// // //         targetState.mousePosition.x,
// // //         currentState.mousePosition.x,
// // //         ANIMATION_CONFIG.transitionSpeed
// // //       );
// // //       currentState.mousePosition.y = updateValue(
// // //         targetState.mousePosition.y,
// // //         currentState.mousePosition.y,
// // //         ANIMATION_CONFIG.transitionSpeed
// // //       );
// // //       currentState.waveIntensity = updateValue(
// // //         targetState.waveIntensity,
// // //         currentState.waveIntensity,
// // //         ANIMATION_CONFIG.transitionSpeed
// // //       );

// // //       const uniforms = planeMesh.material.uniforms;
// // //       uniforms.u_intensity.value = currentState.waveIntensity;
// // //       uniforms.u_time.value += 0.005;
// // //       uniforms.u_mouse.value.set(
// // //         currentState.mousePosition.x,
// // //         currentState.mousePosition.y
// // //       );

// // //       renderer.render(scene, camera);
// // //     }

// // //     function updateValue(targetState, current, transitionSpeed) {
// // //       return current + (targetState - current) * transitionSpeed;
// // //     }

// // //     function handleMouseMove(event) {
// // //       const rect = canvasRef.current.getBoundingClientRect();
// // //       targetState.mousePosition.x =
// // //         ((event.clientX - rect.left) / rect.width) * 2 - 1;
// // //       targetState.mousePosition.y =
// // //         -((event.clientY - rect.top) / rect.height) * 2 + 1;
// // //     }

// // //     function handleTouchStart(event) {
// // //       targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
// // //     }

// // //     function handleTouchMove(event) {
// // //       const touch = event.touches[0];
// // //       const rect = canvasRef.current.getBoundingClientRect();
// // //       targetState.mousePosition.x =
// // //         ((touch.clientX - rect.left) / rect.width) * 2 - 1;
// // //       targetState.mousePosition.y =
// // //         -((touch.clientY - rect.top) / rect.height) * 2 + 1;
// // //     }

// // //     function handleTouchEnd(event) {
// // //       targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
// // //       targetState.mousePosition = { x: 0, y: 0 };
// // //     }

// // //     canvasRef.current.addEventListener("mouseover", () => {
// // //       targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
// // //     });

// // //     canvasRef.current.addEventListener("mouseout", () => {
// // //       targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
// // //       targetState.mousePosition = { x: 0, y: 0 };
// // //     });

// // //     return () => {
// // //       canvasRef.current.removeEventListener("mousemove", handleMouseMove);
// // //       canvasRef.current.removeEventListener("touchstart", handleTouchStart);
// // //       canvasRef.current.removeEventListener("touchmove", handleTouchMove);
// // //       canvasRef.current.removeEventListener("touchend", handleTouchEnd);
// // //       window.removeEventListener("resize", onWindowResize);
// // //     };
// // //   }, [src]);

// // //   return (
// // //     <div className="relative w-full h-full flex justify-center items-center">
// // //       <div
// // //         ref={canvasRef}
// // //         className="w-full h-full absolute top-0 left-0"
// // //       ></div>
// // //     </div>
// // //   );
// // // };

// // // export default WavyImage;



// // import React, { useEffect, useRef } from "react";
// // import * as THREE from "three";

// // const ANIMATION_CONFIG = {
// //   transitionSpeed: 0.03,
// //   baseIntensity: 0.005,
// //   hoverIntensity: 0.09,
// // };

// // // Shaders
// // const vertexShader = `
// //     varying vec2 vUv;
// //     void main() {
// //         vUv = uv;
// //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// //     }
// // `;

// // const fragmentShader = `
// //     uniform float u_time;
// //     uniform vec2 u_mouse;
// //     uniform float u_intensity;
// //     uniform sampler2D u_texture;
// //     varying vec2 vUv;

// //     void main() {
// //         vec2 uv = vUv;
// //         float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 5.0) * u_intensity;
// //         float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 4.0) * u_intensity;
// //         float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 3.0) * u_intensity;
// //         float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 3.5) * u_intensity;

// //         uv.y += wave1 + wave2;
// //         uv.x += wave3 + wave4;
        
// //         gl_FragColor = texture2D(u_texture, uv);
// //     }
// // `;

// // const WavyImage = ({ src }) => {
// //   const canvasRef = useRef(null);
// //   let scene, camera, renderer, planeMesh;
// //   let video, videoTexture;
// //   let currentState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };
// //   let targetState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };

// //   useEffect(() => {
// //     initializeVideo(src);
// //     return () => {
// //       cleanup();
// //     };
// //   }, [src]);

// //   function initializeVideo(videoSrc) {
// //     video = document.createElement('video');
// //     video.src = videoSrc;
// //     video.crossOrigin = 'anonymous';
// //     video.loop = true;
// //     video.muted = true;
// //     video.play();

// //     video.addEventListener('canplay', () => {
// //       videoTexture = new THREE.VideoTexture(video);
// //       initializeScene(videoTexture);
// //     });
// //   }

// //   function initializeScene(texture) {
// //     camera = new THREE.PerspectiveCamera(
// //       80,
// //       canvasRef.current.offsetWidth / canvasRef.current.offsetHeight,
// //       0.01,
// //       10
// //     );
// //     camera.position.z = 1;

// //     scene = new THREE.Scene();

// //     const shaderUniforms = {
// //       u_time: { type: "f", value: 1.0 },
// //       u_mouse: { type: "v2", value: new THREE.Vector2() },
// //       u_intensity: { type: "f", value: currentState.waveIntensity },
// //       u_texture: { type: "t", value: texture },
// //     };

// //     planeMesh = new THREE.Mesh(
// //       new THREE.PlaneGeometry(2, 2),
      
// //       new THREE.ShaderMaterial({
// //         uniforms: shaderUniforms,
// //         vertexShader,
// //         fragmentShader,
// //       })
// //     );

// //     scene.add(planeMesh);

// //     renderer = new THREE.WebGLRenderer();
// //     renderer.setSize(
// //       canvasRef.current.offsetWidth,
// //       canvasRef.current.offsetHeight
// //     );
// //     canvasRef.current.appendChild(renderer.domElement);

// //     window.addEventListener("resize", onWindowResize, false);
// //     canvasRef.current.addEventListener("mousemove", handleMouseMove, false);
// //     canvasRef.current.addEventListener("touchstart", handleTouchStart, false);
// //     canvasRef.current.addEventListener("touchmove", handleTouchMove, false);
// //     canvasRef.current.addEventListener("touchend", handleTouchEnd, false);
// //     animateScene();
// //   }

// //   function onWindowResize() {
// //     camera.aspect = canvasRef.current.offsetWidth / canvasRef.current.offsetHeight;
// //     camera.updateProjectionMatrix();
// //     renderer.setSize(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
// //   }

// //   function animateScene() {
// //     requestAnimationFrame(animateScene);

// //     currentState.mousePosition.x = updateValue(
// //       targetState.mousePosition.x,
// //       currentState.mousePosition.x,
// //       ANIMATION_CONFIG.transitionSpeed
// //     );
// //     currentState.mousePosition.y = updateValue(
// //       targetState.mousePosition.y,
// //       currentState.mousePosition.y,
// //       ANIMATION_CONFIG.transitionSpeed
// //     );
// //     currentState.waveIntensity = updateValue(
// //       targetState.waveIntensity,
// //       currentState.waveIntensity,
// //       ANIMATION_CONFIG.transitionSpeed
// //     );

// //     const uniforms = planeMesh.material.uniforms;
// //     uniforms.u_intensity.value = currentState.waveIntensity;
// //     uniforms.u_time.value += 0.005;
// //     uniforms.u_mouse.value.set(
// //       currentState.mousePosition.x,
// //       currentState.mousePosition.y
// //     );

// //     if (video.readyState >= video.HAVE_CURRENT_DATA) {
// //       videoTexture.needsUpdate = true;
// //     }

// //     renderer.render(scene, camera);
// //   }

// //   function updateValue(targetState, current, transitionSpeed) {
// //     return current + (targetState - current) * transitionSpeed;
// //   }

// //   function handleMouseMove(event) {
// //     const rect = canvasRef.current.getBoundingClientRect();
// //     targetState.mousePosition.x =
// //       ((event.clientX - rect.left) / rect.width) * 2 - 1;
// //     targetState.mousePosition.y =
// //       -((event.clientY - rect.top) / rect.height) * 2 + 1;
// //   }

// //   function handleTouchStart(event) {
// //     targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
// //   }

// //   function handleTouchMove(event) {
// //     const touch = event.touches[0];
// //     const rect = canvasRef.current.getBoundingClientRect();
// //     targetState.mousePosition.x =
// //       ((touch.clientX - rect.left) / rect.width) * 2 - 1;
// //     targetState.mousePosition.y =
// //       -((touch.clientY - rect.top) / rect.height) * 2 + 1;
// //   }

// //   function handleTouchEnd(event) {
// //     targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
// //     targetState.mousePosition = { x: 0, y: 0 };
// //   }

// //   function cleanup() {
// //     canvasRef.current.removeEventListener("mousemove", handleMouseMove);
// //     canvasRef.current.removeEventListener("touchstart", handleTouchStart);
// //     canvasRef.current.removeEventListener("touchmove", handleTouchMove);
// //     canvasRef.current.removeEventListener("touchend", handleTouchEnd);
// //     window.removeEventListener("resize", onWindowResize);
// //     if (video) {
// //       video.pause();
// //       video.src = "";
// //     }
// //   }

// //   return (
// //     <div className="relative w-full h-full flex justify-center items-center">
// //       <div
// //         ref={canvasRef}
// //         className="w-full h-full absolute top-0 left-0"
// //       ></div>
// //     </div>
// //   );
// // };

// // export default WavyImage;



// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

// const ANIMATION_CONFIG = {
//   transitionSpeed: 0.03,
//   baseIntensity: 0.05,
//   hoverIntensity: 0.9,
// };

// // Shaders (unchanged)
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
//         float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 9.0) * u_intensity;
//         float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 9.0) * u_intensity;
//         float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 9.0) * u_intensity;
//         float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 9.5) * u_intensity;

//         uv.y += wave1 + wave2;
//         uv.x += wave3 + wave4;
        
//         gl_FragColor = texture2D(u_texture, uv);
//     }
// `;

// const WavyImage = ({ src }) => {
//   const canvasRef = useRef(null);
//   let scene, camera, renderer, planeMesh;
//   let video, videoTexture;
//   let currentState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };
//   let targetState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };

//   useEffect(() => {
//     initializeVideo(src);
//     return () => {
//       cleanup();
//     };
//   }, [src]);

//   function initializeVideo(videoSrc) {
//     video = document.createElement('video');
//     video.src = videoSrc;
//     video.crossOrigin = 'anonymous';
//     video.loop = true;
//     video.muted = true;
//     video.play();

//     video.addEventListener('canplay', () => {
//       videoTexture = new THREE.VideoTexture(video);
//       initializeScene(videoTexture);
//     });
//   }

//   function initializeScene(texture) {
//     camera = new THREE.PerspectiveCamera(
//       90,
//       window.innerWidth / window.innerHeight, // Use window dimensions
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
//     renderer.setSize(window.innerWidth, window.innerHeight); // Use window dimensions
//     canvasRef.current.appendChild(renderer.domElement);

//     window.addEventListener("resize", onWindowResize, false);
//     canvasRef.current.addEventListener("mousemove", handleMouseMove, false);
//     canvasRef.current.addEventListener("touchstart", handleTouchStart, false);
//     canvasRef.current.addEventListener("touchmove", handleTouchMove, false);
//     canvasRef.current.addEventListener("touchend", handleTouchEnd, false);
//     animateScene();
//   }

//   function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   }

//   function animateScene() {
//     requestAnimationFrame(animateScene);

//     currentState.mousePosition.x = updateValue(
//       targetState.mousePosition.x,
//       currentState.mousePosition.x,
//       ANIMATION_CONFIG.transitionSpeed
//     );
//     currentState.mousePosition.y = updateValue(
//       targetState.mousePosition.y,
//       currentState.mousePosition.y,
//       ANIMATION_CONFIG.transitionSpeed
//     );
//     currentState.waveIntensity = updateValue(
//       targetState.waveIntensity,
//       currentState.waveIntensity,
//       ANIMATION_CONFIG.transitionSpeed
//     );

//     const uniforms = planeMesh.material.uniforms;
//     uniforms.u_intensity.value = currentState.waveIntensity;
//     uniforms.u_time.value += 0.005;
//     uniforms.u_mouse.value.set(
//       currentState.mousePosition.x,
//       currentState.mousePosition.y
//     );

//     if (video.readyState >= video.HAVE_CURRENT_DATA) {
//       videoTexture.needsUpdate = true;
//     }

//     renderer.render(scene, camera);
//   }

//   function updateValue(targetState, current, transitionSpeed) {
//     return current + (targetState - current) * transitionSpeed;
//   }

//   function handleMouseMove(event) {
//     const rect = canvasRef.current.getBoundingClientRect();
//     targetState.mousePosition.x =
//       ((event.clientX - rect.left) / rect.width) * 2 - 1;
//     targetState.mousePosition.y =
//       -((event.clientY - rect.top) / rect.height) * 2 + 1;
//   }

//   function handleTouchStart(event) {
//     targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
//   }

//   function handleTouchMove(event) {
//     const touch = event.touches[0];
//     const rect = canvasRef.current.getBoundingClientRect();
//     targetState.mousePosition.x =
//       ((touch.clientX - rect.left) / rect.width) * 2 - 1;
//     targetState.mousePosition.y =
//       -((touch.clientY - rect.top) / rect.height) * 2 + 1;
//   }

//   function handleTouchEnd(event) {
//     targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
//     targetState.mousePosition = { x: 0, y: 0 };
//   }

//   function cleanup() {
//     canvasRef.current.removeEventListener("mousemove", handleMouseMove);
//     canvasRef.current.removeEventListener("touchstart", handleTouchStart);
//     canvasRef.current.removeEventListener("touchmove", handleTouchMove);
//     canvasRef.current.removeEventListener("touchend", handleTouchEnd);
//     window.removeEventListener("resize", onWindowResize);
//     if (video) {
//       video.pause();
//       video.src = "";
//     }
//   }

//   return (
//     <div className="relative w-full h-full">
//       <div
//         ref={canvasRef}
//         style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
//       ></div>
//     </div>
//   );
// };

// export default WavyImage;



import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ANIMATION_CONFIG = {
  transitionSpeed: 0.03,
  baseIntensity: 0.005,
  hoverIntensity: 0.09,
};

// Shaders (unchanged)
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform sampler2D u_texture;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 9.0) * u_intensity;
        float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 9.0) * u_intensity;
        float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 9.0) * u_intensity;
        float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 9.5) * u_intensity;

        uv.y += wave1 + wave2;
        uv.x += wave3 + wave4;
        
        gl_FragColor = texture2D(u_texture, uv);
    }
`;

const WavyImage = ({ src }) => {
  const canvasRef = useRef(null);
  let scene, camera, renderer, planeMesh;
  let video, videoTexture;
  let currentState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };
  let targetState = { mousePosition: { x: 0, y: 0 }, waveIntensity: 0.005 };

  useEffect(() => {
    initializeVideo(src);
    return () => {
      cleanup();
    };
  }, [src]);

  function initializeVideo(videoSrc) {
    video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.play();

    video.addEventListener('canplay', () => {
      videoTexture = new THREE.VideoTexture(video);
      initializeScene(videoTexture);
    });
  }

  function initializeScene(texture) {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    scene = new THREE.Scene();

    const shaderUniforms = {
      u_time: { type: "f", value: 1.0 },
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_intensity: { type: "f", value: currentState.waveIntensity },
      u_texture: { type: "t", value: texture },
    };

    const aspect = window.innerWidth / window.innerHeight;
    planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2 * aspect, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
      })
    );

    scene.add(planeMesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize, false);
    canvasRef.current.addEventListener("mousemove", handleMouseMove, false);
    canvasRef.current.addEventListener("touchstart", handleTouchStart, false);
    canvasRef.current.addEventListener("touchmove", handleTouchMove, false);
    canvasRef.current.addEventListener("touchend", handleTouchEnd, false);
    animateScene();
  }

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animateScene() {
    requestAnimationFrame(animateScene);

    currentState.mousePosition.x = updateValue(
      targetState.mousePosition.x,
      currentState.mousePosition.x,
      ANIMATION_CONFIG.transitionSpeed
    );
    currentState.mousePosition.y = updateValue(
      targetState.mousePosition.y,
      currentState.mousePosition.y,
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
    uniforms.u_mouse.value.set(
      currentState.mousePosition.x,
      currentState.mousePosition.y
    );

    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      videoTexture.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function updateValue(targetState, current, transitionSpeed) {
    return current + (targetState - current) * transitionSpeed;
  }

  function handleMouseMove(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    targetState.mousePosition.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;
    targetState.mousePosition.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function handleTouchStart(event) {
    targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
  }

  function handleTouchMove(event) {
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    targetState.mousePosition.x =
      ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    targetState.mousePosition.y =
      -((touch.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function handleTouchEnd(event) {
    targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
    targetState.mousePosition = { x: 0, y: 0 };
  }

  function cleanup() {
    canvasRef.current.removeEventListener("mousemove", handleMouseMove);
    canvasRef.current.removeEventListener("touchstart", handleTouchStart);
    canvasRef.current.removeEventListener("touchmove", handleTouchMove);
    canvasRef.current.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("resize", onWindowResize);
    if (video) {
      video.pause();
      video.src = "";
    }
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={canvasRef}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      ></div>
    </div>
  );
};

export default WavyImage;
