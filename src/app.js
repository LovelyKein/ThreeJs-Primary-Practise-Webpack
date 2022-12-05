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


/* 加载环境贴图 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  "/image/environment/px.png",
  "/image/environment/nx.png",
  "/image/environment/py.png",
  "/image/environment/ny.png",
  "/image/environment/pz.png",
  "/image/environment/nz.png",
]);
// 对应 renderer 渲染设置的 renderer.outputEncoding
environmentMap.encoding = THREE.sRGBEncoding;
// 将环境贴图加载到场景中，此时场景可以看见环境贴图
scene.background = environmentMap;
// 直接加在 environment 属性上，就不用给物体再次添加环境贴图
// scene.environment = environmentMap;

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
new GLTFLoader().load("/static/c4d_cube.glb", (glb) => {
  const bikeScene = glb.scene;
  bikeScene.castShadow = true;
  bikeScene.scale.set(0.01, 0.01, 0.01);
  scene.add(bikeScene);
  // 遍历 bikeScene 场景中的所有子元素
  bikeScene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.frustumCulled = false;
      child.castShadow = true;
      // 给物体加上环境贴图
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = 1.4;
    }
  });
});

/* axesHelper */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* Lights */
const ambientLight = new THREE.AmbientLight("#ffffff");
ambientLight.intensity = 0.8;
scene.add(ambientLight);
const pointLight = new THREE.PointLight("#ffffff");
pointLight.intensity = 0.5;
pointLight.position.set(4, 8, 4);
pointLight.castShadow = true;
pointLight.shadow.radius = 5;
pointLight.shadow.mapSize.set(1024, 1024);
scene.add(pointLight);
const helper = new THREE.PointLightHelper(pointLight, 1);
scene.add(helper);

/* Camera */
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
// Camera position is Necessary and Important
camera.position.set(-2.5, 5, 10);

/* renderer */
const renderer = new THREE.WebGLRenderer({
  canvas,
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


/* Post Processing */

// 加载效果处理模块
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
const effectComposer = new EffectComposer(renderer);
// 与 renderer 相同的配置项
effectComposer.setSize(size.width, size.height);
effectComposer.setPixelRatio(window.devicePixelRatio);
// 加载 RenderPass 渲染许可模块
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

/* 效果模块 */

// 1. 像素点效果
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
const dotScreenPass = new DotScreenPass();
// 是否开启效果
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

// 2. 故障效果
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
const glitchPass = new GlitchPass();
glitchPass.enabled = false;
// 是否加强效果
glitchPass.goWild = false;
effectComposer.addPass(glitchPass);

// 3. RGB 色值效果
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
const shaderPass = new ShaderPass(RGBShiftShader);
shaderPass.enabled = false;
effectComposer.addPass(shaderPass);

// 4. 不真实环境效果
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
const unrealBloomPass = new UnrealBloomPass();
// 调整数值，不写则使用默认值
unrealBloomPass.strength = 1.0;// 强度
unrealBloomPass.radius = 1.0;// 半径
unrealBloomPass.threshold = 0.2;// 阈值
effectComposer.addPass(unrealBloomPass);


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

  controls.update();

  // renderer.render(scene, camera);
  // 用 effectComposer 代替渲染
  effectComposer.render();

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
