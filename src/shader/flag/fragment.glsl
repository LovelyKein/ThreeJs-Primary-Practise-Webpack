precision mediump float;

// 在 app.js 文件自定义的 uniform 属性
uniform vec3 uColor;
// 纹理
uniform sampler2D uTexture;

// 接受 vertex.glsl 文件发送来的 vUv vElevation
varying vec2 vUv;
varying float vElevation;

void main()
{
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 0.3 + 0.7;
  gl_FragColor = textureColor;
  // 设置片段颜色
  // vec4(Red, Green, Blue, Alpha);
  // gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
  // gl_FragColor = vec4(uColor, 1.0);
}