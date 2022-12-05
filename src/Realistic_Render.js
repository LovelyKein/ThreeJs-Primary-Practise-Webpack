import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 引入 gltf 格式外部模型加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 引入模型压缩器模块
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

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
// dracoLoader.setDecoderConfig("/static/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("/static/cube.glb", (gltf) => {
  const cube = gltf.scene;
  cube.position.set(0, 1, 0);
  // cube.scale.set(0.3, 0.3, 0.3);
  console.log(cube);
  cube.castShadow = true;
  // 遍历场景里的模型
  cube.traverse((child) => {
    if(child.isMesh){
      child.frustumCulled = false;
      // 模型阴影
      child.castShadow = true
    }
  })
  scene.add(cube);
});


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
ambientLight.intensity = 1;
scene.add(ambientLight);
const pointLight = new THREE.PointLight("#ffffff");
pointLight.intensity = 20;
pointLight.position.set(10, 20, 10);
pointLight.castShadow = true;
pointLight.shadow.radius = 5;
pointLight.shadow.mapSize.set(1024, 1024);
// 解决模型接受阴影时有锯齿的问题；
pointLight.shadow.normalBias = 0.1
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
/* Realistic Render */
renderer.physicallyCorrectLights = true;// 开启物理渲染，会让场景变暗
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
