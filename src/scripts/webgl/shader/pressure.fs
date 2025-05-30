#version 300 es
precision highp float;

uniform sampler2D densityMap;
uniform sampler2D posMap;
uniform sampler2D velMap;
uniform vec2 particlePixel;
uniform float smoothingRadius;
uniform float targetDensity;
uniform float pressureMultiplier;
uniform float nearPressureMultiplier;
uniform float dt;

in vec2 vUv;
out vec4 fragColor;

#include './module/smoothingKernel.glsl'

float PressureFromDensity(float density) {
	return (density - targetDensity) * pressureMultiplier;
}

float NearPressureFromDensity(float nearDensity) {
	return nearPressureMultiplier * nearDensity;
}

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(.1, .2, .3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

void main() {
  vec2 uv = vUv + particlePixel * 0.1;
  vec2 particleAmount = vec2(PARTICLE_AMOUNT_WIDTH, PARTICLE_AMOUNT_HEIGHT);
  vec2 fuv = floor(vUv * particleAmount);

  vec2 density = texture(densityMap, uv).xy;

  float pressure = PressureFromDensity(density.x);
  float nearPressure = NearPressureFromDensity(density.y);

  vec2 pos = texture(posMap, uv).xy;
  vec2 vel = texture(velMap, uv).xy;
  float r2 = smoothingRadius * smoothingRadius;
  vec2 pressureForce;

  for (int ix; ix < PARTICLE_AMOUNT_WIDTH; ix++) {
    for (int iy; iy < PARTICLE_AMOUNT_HEIGHT; iy++) {
      vec2 neighbourUv = (vec2(ix, iy) + 0.1) * particlePixel;

      if (abs(fuv.x - float(ix)) < 1e-5 && abs(fuv.y - float(iy)) < 1e-5) continue;

      vec2 neighbourPos = texture(posMap, neighbourUv).xy;
      vec2 offsetToNeighbour = neighbourPos - pos;
      float d2 = dot(offsetToNeighbour, offsetToNeighbour);

      if (r2 < d2) continue;

      float dst = sqrt(d2);
      // vec2 dirToNeighbour = dst > 0.0 ? offsetToNeighbour / dst : -normalize(vel);
      vec2 dirToNeighbour = dst > 0.0 ? offsetToNeighbour / dst : mix(-normalize(vel), hash(vec3(neighbourUv, 0.1)).xy * 2. - 1., 0.4);

      vec2 neighbourDensity = texture(densityMap, neighbourUv).xy;
      float neighbourPressure = PressureFromDensity(neighbourDensity.x);
      float neighbourNearPressure = NearPressureFromDensity(neighbourDensity.y);

      float sharedPressure     = (pressure     + neighbourPressure)     / (2.0 * neighbourDensity.x);
      float sharedNearPressure = (nearPressure + neighbourNearPressure) / (2.0 * neighbourDensity.y);

      pressureForce += dirToNeighbour * sharedPressure     * PressureDerivativeKernel(dst, smoothingRadius);
      pressureForce += dirToNeighbour * sharedNearPressure * NearPressureDerivativeKernel(dst, smoothingRadius);
    }
  }

  vec2 acc = pressureForce / density.x;
  fragColor.xy = vel + acc * dt;
}
