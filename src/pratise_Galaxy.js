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

/* Galaxy */
const parameter = {
  amount: 5000,
  size: 0.02,
  radius: 5,
  branch: 3,
  spin: 1,
  random: 1,
  power: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

/* define variable */
let geometry = null;
let points = null;
let material = null;

// Generater
function generater() {
  /* Destroy old particles use to Release Memory */
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new BufferGeometry();
  material = new THREE.PointsMaterial({
    size: parameter.size,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    vertexColors: true,
  });
  const positions = new Float32Array(parameter.amount * 3);
  const colors = new Float32Array(parameter.amount * 3);
  const insideColor = new THREE.Color(parameter.insideColor);
  const outsideColor = new THREE.Color(parameter.outsideColor);

  for (let i = 0; i < parameter.amount * 3; i++) {
    const i3 = i * 3;
    const randomRadius = parameter.radius * Math.random();
    const branchAngle =
      ((i % parameter.branch) / parameter.branch) * (Math.PI * 2);
    const spinSelfAngle = randomRadius * parameter.spin;

    const randomX =
      Math.pow(Math.random(), parameter.power) * (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameter.power) * (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameter.power) * (Math.random() < 0.5 ? 1 : -1);

    positions[i3] =
      Math.cos(branchAngle + spinSelfAngle) * randomRadius + randomX; // x
    positions[i3 + 1] = randomY; // y
    positions[i3 + 2] =
      Math.sin(branchAngle + spinSelfAngle) * randomRadius + randomZ; // z

    // color
    const mixColor = insideColor.clone();
    mixColor.lerp(outsideColor, randomRadius / parameter.radius);
    colors[i3] = mixColor.r; // R
    colors[i3 + 1] = mixColor.g; // G
    colors[i3 + 2] = mixColor.b; // B
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  points = new THREE.Points(geometry, material);
  scene.add(points);
}
generater();

/* gui */
gui
  .add(parameter, "amount")
  .min(1000)
  .max(200000)
  .step(500)
  .name("amount")
  .onFinishChange(generater);
gui
  .add(parameter, "size")
  .min(0.02)
  .max(0.5)
  .step(0.02)
  .name("size")
  .onFinishChange(generater);
gui
  .add(parameter, "radius")
  .min(5)
  .max(50)
  .step(5)
  .name("radius")
  .onFinishChange(generater);
gui
  .add(parameter, "branch")
  .min(2)
  .max(10)
  .step(1)
  .name("branch")
  .onFinishChange(generater);
gui
  .add(parameter, "spin")
  .min(0.5)
  .max(2)
  .step(0.01)
  .name("spin")
  .onFinishChange(generater);
gui
  .add(parameter, "random")
  .min(0)
  .max(2)
  .step(0.1)
  .name("random")
  .onFinishChange(generater);
gui
  .add(parameter, "power")
  .min(0)
  .max(10)
  .step(0.1)
  .name("power")
  .onFinishChange(generater);
gui
  .addColor(parameter, "insideColor")
  .name("insideColor")
  .onFinishChange(generater);
gui
  .addColor(parameter, "outsideColor")
  .name("outsideColor")
  .onFinishChange(generater);

const camera = new THREE.PerspectiveCamera(70, size.width / size.height);

// Camera position is Necessary and Important
camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

// OrbitControl
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

renderer.setSize(size.width, size.height);
// Use Device pixelRatio,Make Cube More smooth
renderer.setPixelRatio(window.devicePixelRatio);
// Let container color of all
// renderer.setClearColor("#262837");

/* Active Shadow */
renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();

// animation is here
const frame = () => {
  const elapseTime = clock.getElapsedTime();
  // update controls
  controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
