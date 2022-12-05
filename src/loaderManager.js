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

// 获取 html 元素
const coverBox = document.getElementsByClassName("cover")[0];
const progressNumber = coverBox.getElementsByTagName("p")[0];
const progressLine = coverBox.getElementsByTagName("span")[0];
let isOnload = false;
function coverBoxChange(state) {
  if (state) {
    coverBox.style.display = "none";
  }
}

/* LoadingManager */
const manager = new THREE.LoadingManager();
// onStart
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Started loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};
// onLoad
manager.onLoad = function () {
  console.log("Loading complete!");
  function disappear(callback) {
    coverBox.setAttribute("class", "cover loaded");
    setTimeout(() => {
      isOnload = true;
      callback(isOnload);
    }, 1200);
  }
  disappear(coverBoxChange);
};
// onProgress
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  let progress = Math.floor((itemsLoaded / itemsTotal) * 100);
  progressLine.style.width = progress + "vw";
  progressNumber.innerHTML = progress + "%";
};
// onError
manager.onError = function (url) {
  console.log("There was an error loading " + url);
};

/* 加载环境贴图 */
const cubeTextureLoader = new THREE.CubeTextureLoader(manager);
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
// 将加载管理器 manager 添加到要被检测管理的 Loader 中
new GLTFLoader(manager).load("/static/c4d_cube.glb", (glb) => {
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
      child.material.envMapIntensity = 1.2;
    }
  });
});

// /* axesHelper */
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

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

const clock = new THREE.Clock();
let oldTime = 0;
// animation is here
const frame = () => {
  let elapseTime = clock.getElapsedTime();
  // augmentTime 是每一帧流逝的时间；
  let augmentTime = elapseTime - oldTime;
  oldTime = elapseTime;

  controls.update();

  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
