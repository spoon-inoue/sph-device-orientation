#version 300 es
precision highp float;

uniform sampler2D initPosMap;
uniform bool initFrame;
uniform sampler2D posMap;
uniform sampler2D velMap;
uniform float dt;
uniform vec2 boundsSize;
uniform float collisionDamping;
uniform float particleSize;
uniform vec2 particlePixel;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv + particlePixel * 0.1;

  if (initFrame) {
    fragColor = vec4(texture(initPosMap, uv).xy, 0, 0);
    return;
  }

  vec2 pos = texture(posMap, uv).xy;
  vec2 vel = texture(velMap, uv).xy;
  pos += vel * dt;

  vec2 halfSize = boundsSize * 0.5;
  float halfParticleSize = particleSize * 0.5;

  if (pos.x - halfParticleSize < -halfSize.x) {
    pos.x = -halfSize.x + halfParticleSize;
    vel.x *= -1.0 * collisionDamping;
  } else if (halfSize.x < pos.x + halfParticleSize) {
    pos.x = halfSize.x - halfParticleSize;
    vel.x *= -1.0 * collisionDamping;
  }

  if (pos.y - halfParticleSize < -halfSize.y) {
    pos.y = -halfSize.y + halfParticleSize;
    vel.y *= -1.0 * collisionDamping;
  } else if (halfSize.y < pos.y + halfParticleSize) {
    pos.y = halfSize.y - halfParticleSize;
    vel.y *= -1.0 * collisionDamping;
  }

  fragColor = vec4(pos, vel);
}
