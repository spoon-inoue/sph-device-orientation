#version 300 es
in vec3 position;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D posMap;
uniform float size;

out vec2 vUv;

void main() {
  vUv = uv;

  vec2 pos = texture(posMap, uv).xy;
  gl_PointSize = size;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 0, 1);
}
