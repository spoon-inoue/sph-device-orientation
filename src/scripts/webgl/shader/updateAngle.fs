#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform sampler2D prevPosMap;
uniform sampler2D prevAngleMap;
uniform vec2 particlePixel;

in vec2 vUv;
out vec4 fragColor;

const vec2 BASIS = vec2(0, 1);

void main() {
  vec2 uv = vUv + particlePixel * 0.1;

  vec2 pos = texture(posMap, uv).xy;
  vec2 prevPos = texture(prevPosMap, uv).xy;

  vec2 P = pos - prevPos;
  float dotA = dot(BASIS, normalize(P));

  float angle = texture(prevAngleMap, uv).x;

  if (-1. < dotA && dotA < 1.) {
    vec3 b3 = vec3(BASIS, 0);
    vec3 p3 = vec3(P, 0);
    float dir = sign(cross(b3, p3).z);
    float targetAngle = 0. < dir ? acos(dotA) : acos(-1.) * 2. - acos(dotA);
    angle = mix(angle, targetAngle, clamp(length(P) * 5., 0., 1.));
  }

  fragColor.r = angle;
}
