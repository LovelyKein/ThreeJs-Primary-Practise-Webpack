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

const floor = new THREE.Mesh(
  new THREE.BoxBufferGeometry(20, 0.01, 20, 10, 1, 10),
  new THREE.MeshStandardMaterial({
    color: "#888866",
  })
);
floor.receiveShadow = true;
scene.add(floor);

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
// scene.background = environmentMap;
// 直接加在 environment 属性上，就不用给物体再次添加环境贴图
scene.environment = environmentMap;

// 自行车模型
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const bike = new GLTFLoader().load("/static/bike.glb", (glb) => {
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
      child.material.envMapIntensity = 1;
    }
  });
});

/* axesHelper */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* Lights */
const ambientLight = new THREE.AmbientLight("#ffffff");
ambientLight.intensity = 0.5;
scene.add(ambientLight);
const pointLight = new THREE.PointLight("#ffffff");
pointLight.intensity = 0.6;
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
camera.position.set(-2, 4, 10);

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
// renderer.physicallyCorrectLights = true; // 开启物理渲染，会让场景变暗
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

  // update controls
  controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
