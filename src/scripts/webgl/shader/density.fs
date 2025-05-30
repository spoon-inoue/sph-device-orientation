#version 300 es
precision highp float;

uniform sampler2D posMap;
uniform vec2 particlePixel;
uniform float smoothingRadius;

in vec2 vUv;
out vec4 fragColor;

#include './module/smoothingKernel.glsl'

void main() {
  vec2 uv = vUv + particlePixel * 0.1;

  vec2 pos = texture(posMap, uv).xy;

  float r2 = smoothingRadius * smoothingRadius;
  float density, nearDensity;

  for (int ix; ix < PARTICLE_AMOUNT_WIDTH; ix++) {
    for (int iy; iy < PARTICLE_AMOUNT_HEIGHT; iy++) {
      vec2 neighbourUv = (vec2(ix, iy) + 0.1) * particlePixel;

      // if (abs(uv.x - neighbourUv.x) < particlePixel.x * 0.2 && abs(uv.y - neighbourUv.y) < particlePixel.y * 0.2) continue;

      vec2 neighbourPos = texture(posMap, neighbourUv).xy;
      vec2 offsetToNeighbour = neighbourPos - pos;
      float d2 = dot(offsetToNeighbour, offsetToNeighbour);

      if (r2 < d2) continue;

      float dst = sqrt(d2);
      density     += DensityKernel(dst, smoothingRadius);
      nearDensity += NearDensityKernel(dst, smoothingRadius);
    }
  }

  fragColor.xy = vec2(density, nearDensity);
}
