import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import dat.gui UI adjust module
import * as dat from "dat.gui";
/* Adjust UI */
const gui = new dat.GUI({ width: 300 });

// animation module
// import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.getElementById("display");
const scene = new THREE.Scene();

/* Objects */
const planeGeometry = new THREE.PlaneBufferGeometry(15, 10, 90, 90);
/* Shader */
// 1. 直接用反引号包裹代码
// const cubeMaterial = new THREE.RawShaderMaterial({
//   vertexShader: `
//     uniform mat4 projectionMatrix;
//     uniform mat4 viewMatrix;
//     uniform mat4 modelMatrix;

//     attribute vec3 position;

//     void main()
//     {
//       gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
//     }
//   `,
//   fragmentShader: `
//     precision mediump float;

//     void main()
//     {
//       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//     }
//   `,
// });

// 2. 也可以写在外部文件 shader/test/ 中，代码更简洁，且有插件支持语法高亮
// 引入着色器文件；
import vertexShader from "./shader/flag/vertex.glsl";
import fragmentShader from "./shader/flag/fragment.glsl";
// 引入纹理
const flag = new THREE.TextureLoader().load("/image/flag.jpeg");
const cubeMaterial = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  // 开启线条模式；
  // wireframe: true,
  // 激活 Alpha 模式；
  // transparent: true,
  uniforms: {
    // 自定义一个 uniform 的属性，可以在 vertex.glsl 文件中使用这个属性
    uFrequency: { value: new THREE.Vector2(0.8, 0.8) },
    // 在帧动画 frame() 中赋值
    uTime: { value: 0 },
    // 在 fragment.glsl 文件中使用这个属性
    uColor: { value: new THREE.Color("orange") },
    // 在帧动画 frame() 中赋值
    uTime: { value: 0 },
  },
});
// gui
gui
  .add(cubeMaterial.uniforms.uFrequency.value, "x")
  .min(0)
  .max(5)
  .step(0.1)
  .name("AxesX_Pulse");
gui
  .add(cubeMaterial.uniforms.uFrequency.value, "y")
  .min(0)
  .max(5)
  .step(0.1)
  .name("AxesY_Pulse");
const cubeMesh = new THREE.Mesh(planeGeometry, cubeMaterial);
scene.add(cubeMesh);

/* axesHelper */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* Lights */
const ambientLight = new THREE.AmbientLight("#ffffff");
ambientLight.intensity = 1;
scene.add(ambientLight);
const pointLight = new THREE.PointLight("#ffffff");
pointLight.intensity = 20;
pointLight.position.set(10, 20, 10);
pointLight.castShadow = true;
pointLight.shadow.radius = 5;
pointLight.shadow.mapSize.set(1024, 1024);
scene.add(pointLight);
const helper = new THREE.PointLightHelper(pointLight, 1);
scene.add(helper);

/* Camera */
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
// Camera position is Necessary and Important
camera.position.set(0, 2, 10);

/* renderer */
const renderer = new THREE.WebGLRenderer({
  canvas,
  // Let canvas background is Transparent !
  // alpha: true,
});
renderer.setSize(size.width, size.height);
// Use Device pixelRatio,Make Cube More smooth
renderer.setPixelRatio(window.devicePixelRatio);
// Let container color of all
// renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;
/* Realistic Render */
renderer.physicallyCorrectLights = true; // 开启物理渲染，会让场景变暗
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

/* OrbitControl */
const controls = new OrbitControls(camera, canvas);
// open mouse momentum
/* Important!  -->  need update in frame(); */
controls.enableDamping = true;

// window Resize tigger event
window.addEventListener("resize", () => {
  // Update size
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // Update Camera
  camera.aspect = size.width / size.height;
  // remain Cube shape not change
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// fullScreen event
window.addEventListener("dblclick", () => {
  const fullScreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const clock = new THREE.Clock();
let oldTime = 0;
// animation is here
const frame = () => {
  let elapseTime = clock.getElapsedTime();
  // augmentTime 是每一帧流逝的时间；
  let augmentTime = elapseTime - oldTime;
  oldTime = elapseTime;

  // 值将在 vertex.glsl 文件中引入
  cubeMaterial.uniforms.uTime.value = elapseTime;

  // update controls
  controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
