precision highp float;
uniform sampler2D tWater;
uniform sampler2D tFlow;
uniform float uTime;
varying vec2 vUv;
uniform vec4 res;

void main() {
  vec3 flow = texture2D(tFlow, vUv).rgb;
  vec2 uv = .5 * gl_FragCoord.xy / res.xy;
  vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);
  myUV -= flow.xy * (0.15 * 0.5);
  vec3 tex = texture2D(tWater, myUV).rgb;
  gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
  gl_FragColor.a = tex.r;
}
