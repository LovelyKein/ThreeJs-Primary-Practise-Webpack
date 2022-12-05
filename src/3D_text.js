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

/* 3D Text */
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// /* FontLoader */
const fontLoader = new FontLoader();
const font = fontLoader.load("/font/optimer_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello", {
    font: font,
    size: 2,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  // let object on axes centerPoint
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -textGeometry.boundingBox.max.x / 2,
  //   -textGeometry.boundingBox.max.y / 2,
  //   -textGeometry.boundingBox.max.z / 2
  // );
  
  // also this better
  textGeometry.center();

  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);
});

// axesHekper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* MeshNormalMaterial() */
const material = new THREE.MeshNormalMaterial();
// material.wireframe = true
material.flatShading = true;


// Group
const group = new THREE.Group();

for (let i = 0; i < 100; i++) {
  const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.8, 0.4, 32, 48),
    material
  );
  torus.position.x = (Math.random() - 0.5) * 20;
  torus.position.y = (Math.random() - 0.5) * 20;
  torus.position.z = (Math.random() - 0.5) * 20;

  torus.rotation.x = Math.random() * Math.PI * 2;
  torus.rotation.y = Math.random() * Math.PI * 2;

  group.add(torus);
}

scene.add(group);

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);

// Camera position is Necessary and Important
camera.position.set(0, 0, 10);

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
  group.rotation.y = elapseTime * 0.2;
  group.rotation.x = elapseTime * 0.2;

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

const gui = new dat.GUI();
