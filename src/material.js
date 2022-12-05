import * as THREE from "three";

// import dat.gui UI adjust module
import * as dat from "dat.gui";

// animation module
import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("display");

const scene = new THREE.Scene();


/* MeshBasicMaterial() */
// const material = new THREE.MeshBasicMaterial({
//   color: 0x96c24e,
// });

// // color
// material.color.set('pink')
// // map
// material.map = texture
// // wireframe
// material.wireframe = false
// // opacity
// material.transparent = true
// material.opacity = 0.5


/* MeshNormalMaterial() */
const material = new THREE.MeshNormalMaterial();
// material.wireframe = true
material.flatShading = true

/* MeshMatcapMaterial() */
/* Important!  need a matCap picture use */
// const material = new THREE.MeshMatcapMaterial()

/* MeshDepthMaterial() */
// const material = new THREE.MeshDepthMaterial()

/* MeshLambertMaterial() */
// const material = new THREE.MeshLambertMaterial()

/* MeshStandardMaterial() */
// const material = new THREE.MeshStandardMaterial()

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1.5, 32, 32),
  material
);

// Cube
const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1.5, 1.5, 1.5, 2, 2, 2),
  material
);
cube.position.x = -3;

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(1, 0.4, 32, 48),
  material
);
torus.position.x = 3;

// Group
const group = new THREE.Group();
group.add(sphere, cube, torus);

scene.add(group);

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);

// Camera position is Necessary and Important
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

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

  // animation
  sphere.rotation.y = elapseTime * 0.2;
  cube.rotation.y = elapseTime * 0.2;
  torus.rotation.y = elapseTime * 0.2;

  sphere.rotation.x = elapseTime * 0.2;
  cube.rotation.x = elapseTime * 0.2;
  torus.rotation.x = elapseTime * 0.2;

  camera.position.y = variable.y * 10;
  camera.position.x = variable.x * 10;

  camera.lookAt(group.position);
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();


/* Adjust UI */

const gui = new dat.GUI()
