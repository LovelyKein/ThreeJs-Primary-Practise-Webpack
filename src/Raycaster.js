import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

const textureLoader = new THREE.TextureLoader();

const canvas = document.getElementById("display");

const scene = new THREE.Scene();

/* Objects */
const geometry_1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: "orange" })
);
const geometry_2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: "orange" })
);
geometry_2.position.x = -4;
const geometry_3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 16, 16),
  new THREE.MeshBasicMaterial({ color: "orange" })
);
geometry_3.position.x = 4;
scene.add(geometry_1, geometry_2, geometry_3);

/* Raycaster */
const rayCaster = new THREE.Raycaster();
const origin = new THREE.Vector3(-5, 0, 0);
const direction = new THREE.Vector3(16, 0, 0);
direction.normalize();

rayCaster.set(origin, direction);
const objectSeries = [geometry_1, geometry_2, geometry_3];

const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
// Camera position is Necessary and Important
camera.position.set(0, 0, 5);


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

// Mouse move
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

renderer.setSize(size.width, size.height);
// Use Device pixelRatio,Make Cube More smooth
renderer.setPixelRatio(window.devicePixelRatio);
// Let container color of all
// renderer.setClearColor("#262837");

const clock = new THREE.Clock();

// animation is here
const frame = () => {
  const elapseTime = clock.getElapsedTime();

  /* Object Animation */
  geometry_1.position.y = Math.sin(elapseTime * 1.2) * 1.5;
  geometry_2.position.y = Math.sin(elapseTime * 0.8) * 1.5;
  geometry_3.position.y = Math.sin(elapseTime * 0.4) * 1.5;

  // update the picking ray with the camera and mouse position
  rayCaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = rayCaster.intersectObjects(objectSeries);

  for (const item of objectSeries) {
    // change  all object color
    item.material.color.set(0xff0000);
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set(0xffff00);
  }

  // update controls
  controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
