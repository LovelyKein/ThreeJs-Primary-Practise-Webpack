import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import dat.gui UI adjust module
// import * as dat from "dat.gui";
/* Adjust UI */
// const gui = new dat.GUI({ width: 360 });

// animation module
// import gsap from "gsap";

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();

const canvas = document.getElementById("display");

const scene = new THREE.Scene();

/* Particles */

// Method_1
const particles = new THREE.Points(
  new THREE.SphereBufferGeometry(4, 32, 32),
  new THREE.PointsMaterial({
    size: 0.2,
    // Open size attenuation
    sizeAttenuation: true,
  })
);
// scene.add(particles)

// Method_2
const particleGeometry = new THREE.BufferGeometry();
const amount = 20000;
// random position
const positions = new Float32Array(amount * 3);
// random color
const colors = new Float32Array(amount * 3);
for (let i = 0; i < amount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

const pointTexture = textureLoader.load("/image/point.png");
const particles_2 = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    size: 0.4,
    // Open size attenuation
    sizeAttenuation: true,
    // color: "#2f73af",
    // open Alpha channel
    transparent: true,
    alphaMap: pointTexture,
    /* Better display methods */
    // alphaTest: 0.001,// method - 1: not prefect to display
    // depthTest: false,// method - 2: particle will across others substance !
    depthWrite: false, // method - 3: resolve particle across others substance question
    // open color blending
    blending: THREE.AdditiveBlending,
    // open vertex color
    vertexColors: true,
  })
);
scene.add(particles_2);

const camera = new THREE.PerspectiveCamera(70, size.width / size.height);

// Camera position is Necessary and Important
camera.position.set(0, 4, 8);

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
  // particles_2.rotation.y = elapseTime * 0.4;
  for (let i = 0; i < amount * 3; i++) {
    const i3 = i * 3;
    const x = particleGeometry.attributes.position.array[i3];
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapseTime + x);
  }
  particleGeometry.attributes.position.needsUpdate = true;
  // update controls
  controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
