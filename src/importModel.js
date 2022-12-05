import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 引入 gltf 格式外部模型加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 引入模型压缩器模块
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 引入 fbx 格式外部模型加载器
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// import dat.gui UI adjust module
// import * as dat from "dat.gui";
/* Adjust UI */
// const gui = new dat.GUI({ width: 300 });

// animation module
// import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.getElementById("display");
const scene = new THREE.Scene();

/* Use GLTFLoader */
const dracoLoader = new DRACOLoader();
// 设置 dracoLoader 解析配置路径
dracoLoader.setDecoderConfig("/static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("/static/cube.glb", (gltf) => {
  const planet = gltf.scene;
  planet.position.set(0, 3, -30);
  planet.scale.set(0.3, 0.3, 0.3);
  console.log();
  planet.castShadow = true;
  scene.add(planet);
});

/* Use FBXLoader */
// const fbxLoader = new FBXLoader();
// fbxLoader.load("/static/house.fbx", (fbx) => {
//   const house = fbx.children[4];
//   house.scale.set(0.005, 0.005, 0.005);
//   scene.add(house);
// });

/* Objects */
// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(40, 40),
  new THREE.MeshStandardMaterial()
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

/* axesHelper */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* Lights */
const ambientLight = new THREE.AmbientLight("#ffffff");
ambientLight.intensity = 0.5;
scene.add(ambientLight);
const pointLight = new THREE.PointLight("#ffffff");
pointLight.intensity = 0.5;
pointLight.position.set(10, 20, 10);
pointLight.castShadow = true;
pointLight.shadow.radius = 10;
pointLight.shadow.mapSize.set(1024, 1024);
scene.add(pointLight);
const helper = new THREE.PointLightHelper(pointLight, 1);
scene.add(helper);

/* Camera */
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
// Camera position is Necessary and Important
camera.position.set(0, 10, 10);

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
// renderer.physicallyCorrectLights = true

/* OrbitControl */
const controls = new OrbitControls(camera, canvas);
// open mouse momentum
/* Important!  -->  need update in frame(); */
controls.enableDamping = true;

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
