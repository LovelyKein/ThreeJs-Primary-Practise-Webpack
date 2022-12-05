uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
// custom
uniform float uTime;

attribute vec3 position;// 获取位置坐标
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;


void main()
{
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  // 详细写法
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float elevation = sin(modelPosition.x * 1.0 + uTime) * 0.6;
  elevation += sin(modelPosition.z* 1.0 - uTime) * 0.6;
  // for(float i = 1.0; i <= 4.0; i++){
  //   elevation -= abs(cnoise(vec3(modelPosition.xz * 3.0 * i, uTime * 0.2)) * 0.15 / i);
  // }
  modelPosition.y += elevation;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  vUv = uv;
  vElevation = elevation;
}