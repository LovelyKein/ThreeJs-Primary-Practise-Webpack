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
scene.background = environmentMap;
// scene.environment = environmentMap;

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
new GLTFLoader().load("/static/bike.glb", (glb) => {
  const bikeScene = glb.scene;
  bikeScene.castShadow = true;
  bikeScene.scale.set(0.5, 0.5, 0.5);
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
      child.material.envMapIntensity = 1.2;
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
pointLight.intensity = 5;
pointLight.position.set(4, 8, 4);
pointLight.castShadow = true;
pointLight.shadow.radius = 3;
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

/* 监测 FPS 性能的辅助插件 stats.js */
import Stats from "stats.js";
const stats = new Stats();
// 添加到页面中
document.body.appendChild(stats.dom);


// 1. 在不需要时销毁处理模型和材料
const cube = new THREE.Mesh(new THREE.TorusBufferGeometry(1.0, 0.4, 32, 32), new THREE.MeshStandardMaterial({color: "#ffffff",}));
scene.add(cube);
scene.remove(cube);
// cube.geometry.dispose();
// cube.material.dispose();

// 2. 给合适的物体添加投射阴影和接收阴影

// 3. 关闭阴影渲染的自动更新
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

// 4. 使用合适的像素密度渲染
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 5. 使用实例生成具有相同几何体和材质的模型



const clock = new THREE.Clock();
let oldTime = 0;
// animation is here
const frame = () => {
  // 开始监测
  stats.begin();

  let elapseTime = clock.getElapsedTime();
  // augmentTime 是每一帧流逝的时间；
  let augmentTime = elapseTime - oldTime;
  oldTime = elapseTime;

  controls.update();

  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);

  // 结束监测
  stats.end();
};
frame();
