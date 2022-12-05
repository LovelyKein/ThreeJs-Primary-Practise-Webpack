// 该文件类型有严格的数据类型限制
// 类似于 C 语言
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;// 获取位置坐标
attribute vec2 uv;

varying vec2 vUv;


void main()
{
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  // 详细写法
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  vUv = uv;
}