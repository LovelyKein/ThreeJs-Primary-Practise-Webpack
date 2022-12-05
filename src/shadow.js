import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import dat.gui UI adjust module
import * as dat from "dat.gui";
/* Adjust UI */
const gui = new dat.GUI({ width: 360 });

// animation module
import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("display");

const scene = new THREE.Scene();

// axesHekper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* MeshStandardMaterial() */
const material = new THREE.MeshStandardMaterial();
material.flatShading = true;
material.metalness = 0.1;
material.roughness = 0.4;

// gui UI
gui.add(material, "roughness").min(0).max(1).name("materialRoughness");
gui.add(material, "metalness").min(0).max(1).name("materialMetalness");
// gui.add(material, "flatShading");

// sphere
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1.6, 32, 32),
  material
);
sphere.position.y = 1.65;
sphere.castShadow = true;

// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20, 16, 16),
  material
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

/* Let plane can receive shadow */
plane.receiveShadow = true;

/* Lights */

// AmbientLight()
const ambientLight = new THREE.AmbientLight("#ffffff");
ambientLight.intensity = 0.5;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).name("ambientLightIntensity");

// PointLight()
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 8, 5);
scene.add(pointLight);
gui.add(pointLight, "intensity").min(0).max(1).name("pointLightIntensity");

/* Let Light can casting shadow */
pointLight.castShadow = true;

/* setting shadow quality use to render */
// pointLight.shadow.mapSize.set(1024,1024)
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

/* setting shadow blur radius */
pointLight.shadow.radius = 20;

// Group
const group = new THREE.Group();
group.add(sphere);
group.castShadow = true;
scene.add(group);

const camera = new THREE.PerspectiveCamera(70, size.width / size.height);

// Camera position is Necessary and Important
camera.position.set(0, 6, 12);

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

/* Active Shadow */
renderer.shadowMap.enabled = true;

// save variable outside
let variable = {
  x: null,
  y: null,
};
// Listen Mouse Event
window.addEventListener("mousemove", (event) => {
  variable.x = event.clientX / size.width - 0.5;
  variable.y = -(event.clientY / size.height - 0.5);
});

const clock = new THREE.Clock();

// animation is here
const frame = () => {
  const elapseTime = clock.getElapsedTime();

  sphere.position.x = Math.cos(elapseTime) * 3;
  sphere.position.z = Math.sin(elapseTime) * 3;
  sphere.position.y = Math.abs(Math.sin(elapseTime * 5) * 2) + 1.6;

  // update controls
  controls.update();

  camera.lookAt(group.position);
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
