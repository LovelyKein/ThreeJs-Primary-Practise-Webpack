import * as THREE from "three";
import "./css/style.css";

// import camera controls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import dat.gui UI adjust module
// import * as dat from "dat.gui";
/* Adjust UI */
// const gui = new dat.GUI({ width: 300 });

// animation module
import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();

const canvas = document.getElementById("display");

const scene = new THREE.Scene();

/* Objects */
const material = new THREE.MeshToonMaterial({
  // MeshToonMaterial() need Lights
  color: "orange",
});
const distance = 4;
const geometry_1 = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.8, 0.3, 32, 32),
  material
);
geometry_1.position.set(0, 0, 0);
const geometry_2 = new THREE.Mesh(
  new THREE.TorusKnotBufferGeometry(0.6, 0.2, 128, 64),
  material
);
geometry_2.position.set(0, -distance, 0);
const geometry_3 = new THREE.Mesh(
  new THREE.ConeBufferGeometry(0.8, 1.2, 32, 2),
  material
);
geometry_3.position.set(0, -distance * 2, 0);
scene.add(geometry_1, geometry_2, geometry_3);

const series = [geometry_1, geometry_2, geometry_3];

/* particles */
const amount = 600;
const positions = new Float32Array(amount * 3);
for (let i = 0; i < amount * 3; i++) {
  let i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 15; // x
  positions[i3 + 1] = distance - Math.random() * distance * (series.length + 1); // y
  positions[i3 + 2] = (Math.random() - 0.5) * 15; // z
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particle = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
  })
);
scene.add(particle);

/* Lights */
const directionLight = new THREE.DirectionalLight("#ffffff");
directionLight.intensity = 0.8;
directionLight.position.set(2, 2, 2);
scene.add(directionLight);

/* Camera */
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
// Camera position is Necessary and Important
camera.position.set(0, 0, 4);
// camera group: 解决不能有两种方式都可以操作相机的位置的问题；
const cameraGroup = new THREE.Group();
cameraGroup.add(camera);
scene.add(cameraGroup);
const renderer = new THREE.WebGLRenderer({
  canvas,
  // Let canvas background is Transparent !
  alpha: true,
});

renderer.setSize(size.width, size.height);
// Use Device pixelRatio,Make Cube More smooth
renderer.setPixelRatio(window.devicePixelRatio);
// Let container color of all
// renderer.setClearColor("#262837");

// // OrbitControl
// const controls = new OrbitControls(camera, canvas);
// // open mouse momentum
// /* Important!  -->  need update in frame(); */
// controls.enableDamping = true;

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

// Scroll event
let scrollY = window.screenY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  let newSection = Math.abs(Math.round(scrollY / size.height - 0.1));
  if (currentSection !== newSection) {
    currentSection = newSection;
    // start animation
    gsap.to(series[currentSection].rotation, {
      duration: 1.5,
      x: "+=4",
      y: "+=3",
    });
  }
});

// mousemove event
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = event.clientY / size.height - 0.5;
  // const positionX = cursor.x;
  // const positionY = -cursor.y;
});

const clock = new THREE.Clock();

// animation is here
const frame = () => {
  const elapseTime = clock.getElapsedTime();

  // object animation
  for (const item of series) {
    item.rotation.x += 0.006;
    item.rotation.y += 0.008;
  }

  // camera animation onscroll
  camera.position.y = (-scrollY / size.height) * distance;
  // mousemove Manual cameraGroup,解决同时操作 camera 产生冲突的问题；
  // cameraGroup.position.x = cursor.x; --> 动画没有很平滑，因为在 1 帧就运动完毕；
  cameraGroup.position.x += (cursor.x - cameraGroup.position.x) / 10; // 分部运动，效果更平滑；
  cameraGroup.position.y += (cursor.y - cameraGroup.position.y) / 10;

  // update controls
  // controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
