import React, { useEffect, useRef, useState } from 'react';
import {
  WebGLRenderer,
  WebGLRenderTarget,
  Scene,
  OrthographicCamera,
  PlaneBufferGeometry,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3,
  Color,
  Clock,
  CanvasTexture,
  BufferAttribute,
  BufferGeometry,
  LineLoop,
  LineBasicMaterial,
} from 'three';
import * as dat from 'dat.gui';
import hexRgb from 'hex-rgb';
import WebFont from 'webfontloader';

const baseVertex = `
varying vec2 v_uv;
void main () {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  v_uv = uv;
}
`;

const textFragment = `
uniform sampler2D sampler;
uniform vec3 color;

varying vec2 v_uv;

void main () {
  vec4 texColor = texture2D(sampler, v_uv);
  if (texColor.a < 0.9) {
    discard;
  } else {
    gl_FragColor = vec4(color, 1.0);
  }
}
`;

const persistenceFragment = `
uniform sampler2D velocity;
uniform sampler2D sampler;
uniform float time;
uniform float aspect;
uniform vec2 mousePos;
uniform float noiseFactor;
uniform float noiseScale;
uniform float rgbPersistFactor;
uniform float alphaPersistFactor;

varying vec2 v_uv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main () {
  float a = snoise3(vec3(v_uv * noiseFactor, time * 0.1)) * noiseScale;
  float b = snoise3(vec3(v_uv * noiseFactor, time * 0.1 + 100.0)) * noiseScale;
  vec4 t0 = texture2D(sampler, v_uv + vec2(a, b) + mousePos * 0.005);

  gl_FragColor = vec4(t0.xyz * rgbPersistFactor, alphaPersistFactor);
}
`;

const MotionTrail = () => {
  const canvasRef = useRef();
  const [gui, setGui] = useState(null);
  const mousePos = [0, 0];
  const targetMousePos = [0, 0];
  const fontFamilies = [];
  const OPTIONS = {
    text: 'play',
    noiseFactor: 1,
    noiseScale: 0.0032,
    rgbPersistFactor: 0.98,
    alphaPersistFactor: 0.97,
    color: '#fff',
    borderColor: innerWidth > 800 ? '#111' : '#454545',
    showBorder: true,
    animateColor: false,
    fontFamily: 'montserrat',
  };

  useEffect(() => {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(new Color('#000'));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const clock = new Clock();
    const scene = new Scene();
    const fluidScene = new Scene();

    const orthoCamera = new OrthographicCamera(
      -innerWidth / 2,
      innerWidth / 2,
      innerHeight / 2,
      -innerHeight / 2,
      0.1,
      10
    );
    orthoCamera.position.set(0, 0, 1);
    orthoCamera.lookAt(new Vector3(0, 0, 0));

    const texCanvas = document.createElement('canvas');
    const texCtx = texCanvas.getContext('2d');

    let fluidRenderTarget0 = new WebGLRenderTarget(
      renderer.domElement.clientWidth,
      renderer.domElement.clientHeight
    );
    let fluidRenderTarget1 = fluidRenderTarget0.clone();

    const fullscreenQuadGeometry = new PlaneBufferGeometry(
      innerWidth,
      innerHeight
    );
    const fullscreenQuadMaterial = new ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        time: { value: 0 },
        aspect: { value: innerWidth / innerHeight },
        mousePos: { value: new Vector2(-1, 1) },
        noiseFactor: { value: OPTIONS.noiseFactor },
        noiseScale: { value: OPTIONS.noiseScale },
        rgbPersistFactor: { value: OPTIONS.rgbPersistFactor },
        alphaPersistFactor: { value: OPTIONS.alphaPersistFactor },
      },
      vertexShader: baseVertex,
      fragmentShader: persistenceFragment,
      transparent: true,
    });
    const fullscreenQuad = new Mesh(
      fullscreenQuadGeometry,
      fullscreenQuadMaterial
    );
    fluidScene.add(fullscreenQuad);

    const fullscreenBorderVertices = new Float32Array(4 * 2);
    fullscreenBorderVertices[0] = -innerWidth / 2 + 40;
    fullscreenBorderVertices[1] = innerHeight / 2 - 40;

    fullscreenBorderVertices[2] = innerWidth / 2 - 40;
    fullscreenBorderVertices[3] = innerHeight / 2 - 40;

    fullscreenBorderVertices[4] = innerWidth / 2 - 40;
    fullscreenBorderVertices[5] = -innerHeight / 2 + 40;

    fullscreenBorderVertices[6] = -innerWidth / 2 + 40;
    fullscreenBorderVertices[7] = -innerHeight / 2 + 40;

    const fullscreenBorderGeometry = new BufferGeometry();
    fullscreenBorderGeometry.setAttribute(
      'position',
      new BufferAttribute(fullscreenBorderVertices, 2)
    );
    const fullscreenBorderMaterial = new LineBasicMaterial({
      color: OPTIONS.borderColor,
    });
    const fullscreenBorderMesh = new LineLoop(
      fullscreenBorderGeometry,
      fullscreenBorderMaterial
    );

    scene.add(fullscreenBorderMesh);

    const planeUnit = innerWidth > innerHeight ? innerHeight : innerWidth;
    const labelGeometry = new PlaneBufferGeometry(planeUnit, planeUnit);
    const labelMaterial = new ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        color: { value: new Vector3(1, 1, 1) },
      },
      vertexShader: baseVertex,
      fragmentShader: textFragment,
      transparent: true,
    });
    const labelMesh = new Mesh(labelGeometry, labelMaterial);
    scene.add(labelMesh);

    WebFont.load({
      typekit: { id: 'cdp4bcs' },
      active: drawText,
      fontactive: onFontLoaded,
      fontinactive: onFontLoadError,
    });

    function onAnimLoop() {
      const dt = clock.getDelta();

      if (OPTIONS.animateColor) {
        PERSIST_COLOR[0] += (TARGET_PERSIST_COLOR[0] - PERSIST_COLOR[0]) * dt;
        PERSIST_COLOR[1] += (TARGET_PERSIST_COLOR[1] - PERSIST_COLOR[1]) * dt;
        PERSIST_COLOR[2] += (TARGET_PERSIST_COLOR[2] - PERSIST_COLOR[2]) * dt;
      }

      {
        const mouseSpeed = dt * 5;
        mousePos[0] += (targetMousePos[0] - mousePos[0]) * mouseSpeed;
        mousePos[1] += (targetMousePos[1] - mousePos[1]) * mouseSpeed;

        fullscreenQuadMaterial.uniforms.mousePos.value.x = mousePos[0];
        fullscreenQuadMaterial.uniforms.mousePos.value.y = mousePos[1];
      }

      fullscreenQuadMaterial.uniforms.sampler.value =
        fluidRenderTarget1.texture;
      fullscreenQuadMaterial.uniforms.time.value = clock.getElapsedTime();

      renderer.autoClearColor = false;

      renderer.setRenderTarget(fluidRenderTarget0);
      renderer.clearColor();
      renderer.render(fluidScene, orthoCamera);
      labelMesh.material.uniforms.color.value.set(...PERSIST_COLOR);
      renderer.render(scene, orthoCamera);

      renderer.setRenderTarget(null);
      labelMesh.material.uniforms.color.value.set(...PERSIST_COLOR);
      renderer.render(fluidScene, orthoCamera);
      renderer.render(scene, orthoCamera);

      const temp = fluidRenderTarget0;
      fluidRenderTarget0 = fluidRenderTarget1;
      fluidRenderTarget1 = temp;
    }

    function drawText({
      text = OPTIONS.text,
      fontFamily = OPTIONS.fontFamily,
      horizontalPadding = 0.75,
    } = {}) {
      const idealCanvasSize = 2048;
      const maxTextureSize = Math.min(
        renderer.capabilities.maxTextureSize,
        idealCanvasSize
      );
      texCanvas.width = maxTextureSize;
      texCanvas.height = maxTextureSize;

      texCtx.fillStyle = '#fff';
      texCtx.strokeStyle = '#fff';
      texCtx.lineWidth = 1;
      texCtx.textAlign = 'center';
      texCtx.textBaseline = 'middle';
      const referenceFontSize = 250;
      texCtx.font = `${referenceFontSize}px ${fontFamily}`;
      const textWidth = texCtx.measureText(text).width;
      const deltaWidth = (texCanvas.width * horizontalPadding) / textWidth;
      const fontSise = referenceFontSize * deltaWidth;
      texCtx.font = `${fontSise}px ${fontFamily}`;
      texCtx.fillText(text, texCanvas.width / 2, texCanvas.height / 2);

      labelMaterial.uniforms.sampler.value = new CanvasTexture(texCanvas);
    }

    function onMouseMove(e) {
      const x = (e.pageX / innerWidth) * 2 - 1;
      const y = (1 - e.pageY / innerHeight) * 2 - 1;
      targetMousePos[0] = x;
      targetMousePos[1] = y;
    }

    function setGUISettings() {
      const newGui = new dat.GUI();
      newGui.add(OPTIONS, 'text').onChange((text) => {
        drawText({ text });
      });
      newGui
        .add(OPTIONS, 'noiseFactor', 0.1, 50, 0.1)
        .onChange((v) => {
          fullscreenQuadMaterial.uniforms.noiseFactor.value = v;
        });
      newGui
        .add(OPTIONS, 'noiseScale', 0.002, 0.01, 0.001)
        .onChange((v) => {
          fullscreenQuadMaterial.uniforms.noiseScale.value = v;
        });
      newGui
        .add(OPTIONS, 'rgbPersistFactor', 0.01, 0.99, 0.01)
        .onChange((v) => {
          fullscreenQuadMaterial.uniforms.rgbPersistFactor.value = v;
        });
      newGui
        .add(OPTIONS, 'alphaPersistFactor', 0.01, 0.99, 0.01)
        .onChange((v) => {
          fullscreenQuadMaterial.uniforms.alphaPersistFactor.value = v;
        });
      newGui.add(OPTIONS, 'animateColor');
      newGui.addColor(OPTIONS, 'color').onChange((v) => {
        const [r, g, b] = hexRgb(v, { format: 'array', alpha: false });
        TARGET_PERSIST_COLOR[0] = r / 255;
        TARGET_PERSIST_COLOR[1] = g / 255;
        TARGET_PERSIST_COLOR[2] = b / 255;
      });
      newGui.addColor(OPTIONS, 'borderColor').onChange((v) =>
        fullscreenBorderMaterial.color.set(v)
      );
      newGui
        .add(OPTIONS, 'fontFamily', fontFamilies)
        .onChange((fontFamily) => drawText({ fontFamily }));
      setGui(newGui);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize);
    function onWindowResize() {
      fluidRenderTarget0.dispose();
      fluidRenderTarget1.dispose();
      fluidRenderTarget0 = new WebGLRenderTarget(
        renderer.domElement.clientWidth,
        renderer.domElement.clientHeight
      );
      fluidRenderTarget1 = fluidRenderTarget0.clone();

      orthoCamera.left = -innerWidth / 2;
      orthoCamera.right = innerWidth / 2;
      orthoCamera.top = innerHeight / 2;
      orthoCamera.bottom = -innerHeight / 2;
      orthoCamera.updateProjectionMatrix();

      renderer.setSize(innerWidth, innerHeight);

      fullscreenQuad.geometry = new PlaneBufferGeometry(
        innerWidth,
        innerHeight
      );
    }

    setGUISettings();
    renderer.setAnimationLoop(onAnimLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      if (gui) gui.destroy();
      renderer.dispose();
    };
  }, []);

  function onFontLoaded(font) {
    fontFamilies.push(font.family);
  }

  function onFontLoadError(font) {
    console.error(`Failed to load ${font.family}`);
  }

  return <div ref={canvasRef} />;
};

export default MotionTrail;
