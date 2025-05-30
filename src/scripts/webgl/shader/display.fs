#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform sampler2D angleMap;
uniform sampler2D arrowMap;

in vec2 vUv;
out vec4 fragColor;

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(.1, .2, .3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a));

void main() {
  float angle = texture(angleMap, vUv).x;

  vec2 uv = gl_PointCoord;
  uv.y = 1. - uv.y;

  uv -= 0.5;
  uv *= rot(angle);
  uv += 0.5;

  float arrow = texture(arrowMap, uv).r;
  fragColor += arrow;

  if (hash(vec3(vUv, 0.1)).x < 0.05) {
    fragColor.gb *= 0.;
  }
}
