#version 300 es
precision highp float;

uniform sampler2D densityMap;
uniform sampler2D posMap;
uniform sampler2D velMap;
uniform vec2 particlePixel;
uniform float smoothingRadius;
uniform float viscosityStrength;
uniform float dt;

in vec2 vUv;
out vec4 fragColor;

#include './module/smoothingKernel.glsl'

void main() {
  vec2 uv = vUv + particlePixel * 0.1;
  vec2 particleAmount = vec2(PARTICLE_AMOUNT_WIDTH, PARTICLE_AMOUNT_HEIGHT);
  vec2 fuv = floor(vUv * particleAmount);

  float density = texture(densityMap, uv).x;
  vec2 pos = texture(posMap, uv).xy;
  vec2 vel = texture(velMap, uv).xy;

  float r2 = smoothingRadius * smoothingRadius;

  vec2 viscosityForce;

  for (int ix; ix < PARTICLE_AMOUNT_WIDTH; ix++) {
    for (int iy; iy < PARTICLE_AMOUNT_HEIGHT; iy++) {
      vec2 neighbourUv = (vec2(ix, iy) + 0.1) * particlePixel;

      if (abs(fuv.x - float(ix)) < 1e-5 && abs(fuv.y - float(iy)) < 1e-5) continue;

      vec2 neighbourPos = texture(posMap, neighbourUv).xy;
      vec2 offsetToNeighbour = neighbourPos - pos;
      float d2 = dot(offsetToNeighbour, offsetToNeighbour);

      if (r2 < d2) continue;

      float dst = sqrt(d2);

      vec2 neighbourVel = texture(velMap, neighbourUv).xy;
      float neighbourDensity = texture(densityMap, neighbourUv).x;

      viscosityForce += (neighbourVel - vel) / neighbourDensity * ViscosityKernel(dst, smoothingRadius);
    }
  }

  vec2 acc = viscosityForce / density;

  fragColor.xy = vel + acc * dt * viscosityStrength;
}
