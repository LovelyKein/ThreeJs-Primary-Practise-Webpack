precision mediump float;

// 在 app.js 文件自定义的 uniform 属性
uniform vec3 uColor;

varying vec2 vUv;


void main()
{
  // 设置片段颜色
  // vec4(Red, Green, Blue, Alpha);

  // // pattern_1
  // gl_FragColor = vec4(vUv, 1.0, 1.0);

  // pattern_2
  gl_FragColor = vec4(vUv.y, vUv.x, 0.5, 1.0);

  // pattern_3
  // gl_FragColor = vec4(vUv.y, vUv.y, vUv.y, 1.0);

  // pattern_4
  // gl_FragColor = vec4(vUv.y * 5.0, vUv.y * 5.0, vUv.y * 5.0, 1.0);

  // pattern_5
  // float strength = mod(vUv.y * 5.0, 1.0);// 取模运算
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_6
  // float strength = mod(vUv.y * 5.0, 1.0);
  // if(strength < 0.5){
  //   strength = 0.0;
  // } else {
  //   strength = 1.0;
  // }
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_7
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

  // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
  // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

  // float strength = barX + barY;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_8
  // float strength = abs(vUv.x - 0.5);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_9
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));// 取最小值
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));// 取最大值
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_10
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_11
  // float strength = floor(vUv.x * 10.0) / 10.0;// 向下取整
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_12
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // strength *= floor(vUv.y * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_13
  // float strength = length(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // pattern_14
  // float strength = 0.02 / distance(vUv, vec2(0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // // pattern_15
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
}