precision mediump float;

// 在 app.js 文件自定义的 uniform 属性
uniform vec3 uColor;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying vec2 vUv;
varying float vElevation;


void main()
{
  vec3 mixColor = mix(uDepthColor, uSurfaceColor, vElevation * 0.6 + 0.8);
  gl_FragColor = vec4(mixColor, 1.0);
}