// 该文件类型有严格的数据类型限制
// 类似于 C 语言
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
// 在 app.js 中自定义的属性
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;// 获取位置坐标
attribute vec2 uv;// 获取 uv 

// 发送给 fragment.glsl 文件使用
varying vec2 vUv;
varying float vElevation;

void main()
{
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  // 详细写法
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.5;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.5;;
  // 让模型分段上 z 轴 点的位置随 x 轴点的位置呈正弦曲线
  // modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.5;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.5;
  modelPosition.z += elevation;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  // 给 vUv 赋值
  vUv = uv;
  // 给 vElevation 赋值
  vElevation = elevation;
}

// not have console.log()

// /* 声明变量 */

// // 小数
// float a = 1.314;// true
// // float b = 5;// false
// float b = 5.20;
// float c = a * b;

// // 整数
// int d = 10;
// int e = 5;
// int f = d / e;

// // 转换类型
// int intB = int(b);
// // 布尔值
// bool foo = true;
// bool bar = false;

// /* 向量 */

// // vec2 向量
// vec2 line = vec2(1.0, 2.0);
// // 改变值；
// line.x = 2.0;
// line.y = 1.0;

// // vec3 向量
// vec3 spaceLine = vec3(2.0, 1.0, 3.0);
// // 改变值
// spaceLine.x = 1.0;
// spaceLine.y = 2.0;
// spaceLine.z = 3.0;

// // 根据 vec2 向量创建 vec3 向量；
// vec3 extend = vec3(line, 2.0);

// // vec4 向量；
// vec4 thing = vec4(spaceLine, 2.0);