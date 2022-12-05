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
const geometry = new THREE.BoxBufferGeometry(2, 2, 2, 2, 2, 2);

// SphereBufferGeometry
// const geometry = new THREE.SphereBufferGeometry(0.8,32,32)

// // BufferGeometry
// const geometry = new THREE.BufferGeometry();
// // Triangle amount
// const amount = 10;
// const positionArray = new Float32Array(amount * 3 * 3);
// for (let i = 0; i < amount * 3 * 3; i++) {
//   positionArray[i] = (Math.random() - 0.5) * 2.5;
// }
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
// geometry.setAttribute("position", positionAttribute);

/* Textures */

// const image = new Image()
// const texture = new THREE.Texture(image);
// image.onload = () => {
//   texture.needsUpdate = true
// }
// image.onerror = (err) => {
//   console.log(err.message);
// };
// image.src = "/public/imgs/wood.jpg";

// Better Usage for TextureLoader()
const texture = new THREE.TextureLoader().load("/image/wood.jpg");
// more loading
// const texture_2 = new THREE.TextureLoader().load("/public/imgs/metal.jpg");

// repeat
// texture.repeat.x = 2
// texture.repeat.y = 2;

// offset
// texture.offset.x = 0.5
// texture.offset.y = 0.5;

// rotation
// texture.rotation = Math.PI / 4;
// roration center
// texture.center.x = 0.5;
// texture.center.y = 0.5;

// fminFilter
// texture.minFilter = THREE.NearestFilter;
// magFilter
texture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshBasicMaterial({
  // color: 0x96c24e,
  // wireframe: true,
  map: texture,
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
