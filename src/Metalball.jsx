import {
  ballsVertexShader,
  ballsFragmentShader,
  quadVertexShader,
  quadFragmentShader,
} from "./Shader";
const CONFIG = {
  ballsCount: 500,
  ballRadius: isMobileBrowser() ? 50 : 100,
  gravity: 0.1,
  startVelocityX: { min: 0, max: 0.1 },
  startVelocityY: { min: 1, max: 3 },
  isDebug: false,
};

const dpr = devicePixelRatio > 2.5 ? 2.5 : devicePixelRatio;
const contentWrapper = document.querySelector(".content");
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl2");
const mousePos = { x: innerWidth / 2, y: innerHeight / 2 };
const quadVertexArrayObject = gl.createVertexArray();
const ballsVertexArrayObject = gl.createVertexArray();
const ballsOffsetsBuffer = gl.createBuffer();

if (!gl) {
  document.body.classList.add("webgl2-not-supported");
}

let oldTime = 0;
let canvasbbox;
let quadWebGLProgram;
let ballsWebGLProgram;
let quadTextureUniformLoc;
let quadVertexBuffer;
let ballsOffsetsArray;
let ballsVelocitiesArray;
let framebuffer;
let targetTexture;
let textureInternalFormat;
let textureType;

/* ------- Use correct WebGL texture internal format depending on what the hardware supports ------- */
{
  textureInternalFormat = gl.RGBA;
  textureType = gl.UNSIGNED_BYTE;
  const rgba32fSupported =
    gl.getExtension("EXT_color_buffer_float") &&
    gl.getExtension("OES_texture_float_linear");
  if (rgba32fSupported) {
    textureInternalFormat = gl.RGBA32F;
    textureType = gl.FLOAT;
  } else {
    const rgba16fSupported =
      gl.getExtension("EXT_color_buffer_half_float") &&
      gl.getExtension("OES_texture_half_float_linear");
    if (rgba16fSupported) {
      textureInternalFormat = gl.RGBA16F;
      textureType = gl.HALF_FLOAT;
    }
  }
}

/* ------- Create metaballs WebGL program ------- */
{
  const vertexShader = makeWebglShader(gl, {
    shaderType: gl.VERTEX_SHADER,
    shaderSource: `#version 300 es\n${ballsVertexShader}`,
  });
  const fragmentShader = makeWebglShader(gl, {
    shaderType: gl.FRAGMENT_SHADER,
    shaderSource: `#version 300 es\n${ballsFragmentShader}`,
  });
  ballsWebGLProgram = makeWebglProram(gl, { vertexShader, fragmentShader });
}

/* ------- Create and assign metaballs WebGL attributes ------- */
{
  const vertexArray = new Float32Array([
    -CONFIG.ballRadius / 2,
    CONFIG.ballRadius / 2,
    CONFIG.ballRadius / 2,
    CONFIG.ballRadius / 2,
    CONFIG.ballRadius / 2,
    -CONFIG.ballRadius / 2,
    -CONFIG.ballRadius / 2,
    CONFIG.ballRadius / 2,
    CONFIG.ballRadius / 2,
    -CONFIG.ballRadius / 2,
    -CONFIG.ballRadius / 2,
    -CONFIG.ballRadius / 2,
  ]);
  const uvsArray = makeQuadUVs();

  ballsOffsetsArray = new Float32Array(CONFIG.ballsCount * 2);
  ballsVelocitiesArray = new Float32Array(CONFIG.ballsCount * 2);

  for (let i = 0; i < CONFIG.ballsCount; i++) {
    ballsOffsetsArray[i * 2] = Math.random() * innerWidth;
    ballsOffsetsArray[i * 2 + 1] = Math.random() * innerHeight;

    ballsVelocitiesArray[i * 2] =
      (Math.random() * 2 - 1) * CONFIG.startVelocityX.max +
      CONFIG.startVelocityX.min;
    ballsVelocitiesArray[i * 2 + 1] =
      Math.random() * CONFIG.startVelocityY.max + CONFIG.startVelocityY.min;
  }
  const vertexBuffer = gl.createBuffer();
  const uvsBuffer = gl.createBuffer();

  const a_position = gl.getAttribLocation(ballsWebGLProgram, "a_position");
  const a_uv = gl.getAttribLocation(ballsWebGLProgram, "a_uv");
  const a_offsetPosition = gl.getAttribLocation(
    ballsWebGLProgram,
    "a_offsetPosition"
  );

  gl.bindVertexArray(ballsVertexArrayObject);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvsArray, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a_uv);
  gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, ballsOffsetsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ballsOffsetsArray, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(a_offsetPosition);
  gl.vertexAttribPointer(a_offsetPosition, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(a_offsetPosition, 1);

  gl.bindVertexArray(null);
}

/* ------- Create fullscreen quad WebGL program ------- */
{
  const vertexShader = makeWebglShader(gl, {
    shaderType: gl.VERTEX_SHADER,
    shaderSource: `#version 300 es\n${quadVertexShader}`,
  });
  const fragmentShader = makeWebglShader(gl, {
    shaderType: gl.FRAGMENT_SHADER,
    shaderSource: `#version 300 es\n${quadFragmentShader}`,
  });
  quadWebGLProgram = makeWebglProram(gl, { vertexShader, fragmentShader });
}

/* ------- Create and assign fullscreen quad WebGL attributes ------- */
{
  const vertexArray = new Float32Array([
    0,
    innerHeight / 2,
    innerWidth / 2,
    innerHeight / 2,
    innerWidth / 2,
    0,
    0,
    innerHeight / 2,
    innerWidth / 2,
    0,
    0,
    0,
  ]);
  const uvsArray = makeQuadUVs();

  quadVertexBuffer = gl.createBuffer();
  const uvsBuffer = gl.createBuffer();

  const a_position = gl.getAttribLocation(quadWebGLProgram, "a_position");
  const a_uv = gl.getAttribLocation(quadWebGLProgram, "a_uv");

  gl.bindVertexArray(quadVertexArrayObject);

  gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvsArray, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a_uv);
  gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
}

/* ------- Create WebGL framebuffer to render to ------- */
makeFramebuffer();

init();

function init() {
  contentWrapper.appendChild(canvas);
  resize();
  setTimeout(() => {
    canvasbbox = canvas.getBoundingClientRect();
  }, 0);
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("click", onMouseClick);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.useProgram(quadWebGLProgram);
  quadTextureUniformLoc = gl.getUniformLocation(quadWebGLProgram, "u_texture");

  window.requestAnimationFrame(renderFrame);
}

function onMouseMove(event) {
  mousePos.x = event.clientX;
  mousePos.y = innerHeight - event.clientY;
}

function onMouseClick() {
  CONFIG.isDebug = !CONFIG.isDebug;
}

function makeFramebuffer() {
  targetTexture = gl.createTexture();
  framebuffer = gl.createFramebuffer();

  gl.bindTexture(gl.TEXTURE_2D, targetTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    textureInternalFormat,
    innerWidth * dpr,
    innerHeight * dpr,
    0,
    gl.RGBA,
    textureType,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    targetTexture,
    0
  );

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Incomplete framebuffer");
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function renderFrame(time) {
  const dt = time - oldTime;
  oldTime = time;

  if (resizeCanvas()) return;

  /* -------- Update balls positions based on physics -------- */
  for (let i = 0; i < CONFIG.ballsCount; i++) {
    let vx = ballsVelocitiesArray[i * 2];
    let vy = ballsVelocitiesArray[i * 2 + 1];

    ballsOffsetsArray[i * 2] += vx * dt;
    ballsOffsetsArray[i * 2 + 1] += vy * dt;

    ballsVelocitiesArray[i * 2 + 1] -= CONFIG.gravity;

    if (ballsOffsetsArray[i * 2] <= 0) {
      ballsOffsetsArray[i * 2] = 0;
      ballsVelocitiesArray[i * 2] *= -1;
    }

    if (ballsOffsetsArray[i * 2] >= innerWidth) {
      ballsOffsetsArray[i * 2] = innerWidth;
      ballsVelocitiesArray[i * 2] *= -1;
    }

    if (ballsOffsetsArray[i * 2 + 1] <= 0) {
      ballsOffsetsArray[i * 2 + 1] = 0;
      ballsVelocitiesArray[i * 2 + 1] *= -1;
    }

    if (ballsOffsetsArray[i * 2 + 1] >= innerHeight) {
      ballsOffsetsArray[i * 2 + 1] = innerHeight;
      ballsVelocitiesArray[i * 2 + 1] =
        Math.random() * CONFIG.startVelocityY.max + CONFIG.startVelocityY.min;
      ballsOffsetsArray[i * 2] = mousePos.x;
      ballsOffsetsArray[i * 2 + 1] = mousePos.y;
    }
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, ballsOffsetsBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, ballsOffsetsArray);

  /* -------- Render balls to framebuffer -------- */
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.viewport(0, 0, innerWidth * dpr, innerHeight * dpr);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(ballsWebGLProgram);
  gl.bindVertexArray(ballsVertexArrayObject);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, CONFIG.ballsCount);
  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  /* -------- Render fullscreen quad with framebuffer texture -------- */
  gl.viewport(0, 0, innerWidth * dpr, innerHeight * dpr);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(quadWebGLProgram);
  gl.bindVertexArray(quadVertexArrayObject);
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);
  gl.uniform1i(quadTextureUniformLoc, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.bindVertexArray(null);

  window.requestAnimationFrame(renderFrame);
}

function makeQuadUVs() {
  return new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);
}

function resizeCanvas() {
  const displayWidth = innerWidth * dpr;
  const displayHeight = innerHeight * dpr;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    makeFramebuffer();
    return true;
  }
  return false;
}

function makeWebglShader(gl, { shaderType, shaderSource }) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function makeWebglProram(gl, { vertexShader, fragmentShader }) {
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }
  return shaderProgram;
}

function makeProjectionMatrix(outMatrix, viewWidth, viewHeight) {
  const left = 0;
  const right = viewWidth;
  const bottom = 0;
  const top = viewHeight;
  const near = 0;
  const far = 1;

  const a = 2 / (right - left);
  const b = 2 / (top - bottom);
  const c = -2 / (far - near);

  const tx = -(right + left) / (right - left);
  const ty = -(top + bottom) / (top - bottom);
  const tz = -(far + near) / (far - near);

  outMatrix[0] = a;
  outMatrix[1] = 0;
  outMatrix[2] = 0;
  outMatrix[3] = 0;

  outMatrix[4] = 0;
  outMatrix[5] = b;
  outMatrix[6] = 0;
  outMatrix[7] = 0;

  outMatrix[8] = 0;
  outMatrix[9] = 0;
  outMatrix[10] = c;
  outMatrix[11] = 0;

  outMatrix[12] = tx;
  outMatrix[13] = ty;
  outMatrix[14] = tz;
  outMatrix[15] = 1;
}

function isMobileBrowser() {
  const check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|nokia|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series40|symbian|treo|up\.browser|up\.link|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        a
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
