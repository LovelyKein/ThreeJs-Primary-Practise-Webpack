import * as THREE from "three";

// import camera controls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import dat.gui UI adjust module
import * as dat from "dat.gui";
/* Adjust UI */
const gui = new dat.GUI({width: 360});

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
const material = new THREE.MeshStandardMaterial()
// material.flatShading = true;
material.metalness = 0.1
material.roughness = 0.4

// gui UI
gui.add(material, "roughness").min(0).max(1).name('materialRoughness')
gui.add(material, "metalness").min(0).max(1).name("materialMetalness");
// gui.add(material, "flatShading");


// Torus
const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(1.2, 0.4, 32, 48),
  material
);

// cube
const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2), material);
cube.position.x = -3.6;

// sphere
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1.6, 32, 32),
  material
);
sphere.position.x = 3.6;

// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20, 16, 16),
  material
);
plane.rotation.x = - Math.PI / 2;
plane.position.y = -3;
scene.add(plane)

/* Lights */
/* Lights need MeshStandardMaterial() can be have effect */

// AmbientLight()
const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.5
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).name("ambientLightIntensity");

// PointLight()
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);
gui.add(pointLight, "intensity").min(0).max(1).name("pointLightIntensity");

// DirectionalLight()
const directionLight = new THREE.DirectionalLight('orange')
directionLight.position.set(3,3,0)
directionLight.intensity = 0.1
scene.add(directionLight)

// HemisphereLight()
const hemisphereLight = new THREE.HemisphereLight("#ff0000", "#0000ff", 0.3);
scene.add(hemisphereLight);

// RectAreaLight()
const rectAreaLight = new THREE.RectAreaLight('#4e00ff',2,3,2)
rectAreaLight.position.set(-1,0,3)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// SpotLight
const spotLight = new THREE.SpotLight('#78ffd6',0.6,10,Math.PI/10,0.25,1)
spotLight.position.set(0,3,3)
scene.add(spotLight)

/* Lights Performance */ 
// Minimal: AmbientLight()    HemisphereLight()
// middle: PointLight()    DirectionalLight()
// more: SpotLight()    RectAreaLight()


/* Lights Helper */

// DirectionalLightHelper()
const directionalLightHelper = new THREE.DirectionalLightHelper(directionLight,0.4)
scene.add(directionalLightHelper)

// DirectionalLightHelper()
const pointlLightHelper = new THREE.PointLightHelper(pointLight, 0.6);
scene.add(pointlLightHelper);


// Group
const group = new THREE.Group();
group.add(torus, cube, sphere);
scene.add(group);

const camera = new THREE.PerspectiveCamera(70, size.width / size.height);

// Camera position is Necessary and Important
camera.position.set(0, 0, 14);

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

  // group animation
  torus.rotation.y = elapseTime * 0.2;
  torus.rotation.x = elapseTime * 0.2;

  sphere.rotation.y = elapseTime * 0.2;
  sphere.rotation.x = elapseTime * 0.2;

  cube.rotation.y = elapseTime * 0.2;
  cube.rotation.x = elapseTime * 0.2;

  // update controls
  controls.update();

  camera.lookAt(group.position);
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
