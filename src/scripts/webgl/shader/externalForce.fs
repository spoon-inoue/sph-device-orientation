#version 300 es
precision highp float;

uniform sampler2D velMap;
uniform vec2 particlePixel;
uniform vec2 gravity;
uniform float dt;
uniform vec2 mousePosition;
uniform float mouseSize;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv + particlePixel * 0.1;

  vec4 particleData = texture(velMap, uv);
  vec2 pos = particleData.xy;
  vec2 vel = particleData.zw;

  vel += gravity * dt;

  vec2 dir = normalize(pos - mousePosition);
  vec2 mouseVel = dir * smoothstep(mouseSize, 0.0, distance(pos, mousePosition));
  vel += mouseVel * 10.0;

  fragColor.xy = vel;
}
