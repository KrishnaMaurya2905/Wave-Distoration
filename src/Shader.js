export const ballsVertexShader = `
precision highp float;

in vec2 v_uv;

out vec4 outputColor;

void main () {
  float dist = distance(v_uv, vec2(0.5));
  float c = clamp(0.5 - dist, 0.0, 1.0);
  outputColor = vec4(vec3(1.0), c);
}`;

export const ballsFragmentShader = `
uniform mat4 u_projectionMatrix;
      
in vec4 a_position;
in vec4 a_offsetPosition;
in vec2 a_uv;

out vec2 v_uv;

void main () {
  vec4 correctOffsetedPosition = a_offsetPosition + a_position;
  gl_Position = u_projectionMatrix * correctOffsetedPosition;
  v_uv = a_uv;
}`;

export const quadVertexShader = `
precision highp float;

uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 outputColor;

void main () {
  vec4 inputColor = texture(u_texture, v_uv);

  float cutoffThreshold = 0.14;

  float cutoff = step(cutoffThreshold, inputColor.a);
  float threshold = 0.005;

  outputColor = mix(
    vec4(0.169,0.227,0.404, 1),
    vec4(1.,0.608,0.443, 1),
    cutoff
  );

  cutoffThreshold += 0.05;

  cutoff = step(cutoffThreshold, inputColor.a);
  outputColor = mix(
    outputColor,
    vec4(0.91,0.282,0.333, 1),
    cutoff
  );
}`;

export const quadFragmentShader = `
uniform mat4 u_projectionMatrix;

in vec4 a_position;
in vec2 a_uv;

out vec2 v_uv;

void main () {
  gl_Position = u_projectionMatrix * a_position;
  v_uv = a_uv;
}
`;
