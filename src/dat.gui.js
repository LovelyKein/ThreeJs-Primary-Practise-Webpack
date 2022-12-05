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

// BoxBufferGeometry
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);


const material = new THREE.MeshBasicMaterial({
  color: 0x96c24e,
  // only display framework with segement
  // wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

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

// animation is here
const frame = () => {
  // Effect - 1
  // mesh.position.x = variable.x * 5;
  // mesh.position.y = variable.y * 5;

  // Effect - 2
  camera.position.x = Math.sin(variable.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(variable.x * Math.PI * 2) * 3;
  camera.position.y = variable.y * 5;

  camera.lookAt(mesh.position);
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();

// Debug UI use for gui
const gui = new dat.GUI({
  width: 300,
});

const parameter = {
  color: "#96c24e",
  rotate() {
    console.log("rotate");
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + Math.PI,
    });
  },
};

/* position */
// gui.add(mesh.position, "x", -3, 3, 0.01);
// also this usage
gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("CubeAxesX");
gui.add(mesh.position, "y", -3, 3, 0.01).name("CubeAxesY");
gui.add(mesh.position, "z", -3, 3, 0.01).name("CubeAxesZ");

/* visible */
gui.add(mesh, "visible");

/* wireframe */
gui.add(mesh.material, "wireframe");

/* color */
gui.addColor(parameter, "color").onChange(() => {
  mesh.material.color.set(parameter.color);
});

/* rotate */
gui.add(parameter, "rotate");
