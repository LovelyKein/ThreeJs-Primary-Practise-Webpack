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

/* Fog */
const fog = new THREE.Fog("#262837", 3, 12);
scene.fog = fog;

/* substance */

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(32, 32),
  new THREE.MeshStandardMaterial({ color: "#b7d07a" })
);
floor.rotation.x = -(Math.PI / 2);
scene.add(floor)
floor.receiveShadow = true;

// wall
const wallTexture = textureLoader.load("/image/brick.jpg");
const wallLineTexture = textureLoader.load("/image/brickLine.jpg");
// teture repeat
wallTexture.repeat.set(2, 2);
wallLineTexture.repeat.set(2, 2);
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallLineTexture.wrapS = THREE.RepeatWrapping;
wallLineTexture.wrapT = THREE.RepeatWrapping;
const wall = new THREE.Mesh(
  new THREE.BoxBufferGeometry(6, 3, 6),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
    normalMap: wallLineTexture,
  })
);
wall.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
);
wall.position.y = 1.5;

// roof
const roofTexture = textureLoader.load("/image/roof.jpg");
const roofLineTexture = textureLoader.load("/image/roofLine.jpg");
// teture repeat
roofTexture.repeat.set(10, 4);
roofLineTexture.repeat.set(10, 4);
roofTexture.wrapS = THREE.RepeatWrapping;
roofTexture.wrapT = THREE.RepeatWrapping;
roofLineTexture.wrapS = THREE.RepeatWrapping;
roofLineTexture.wrapT = THREE.RepeatWrapping;
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(5, 2, 4, 1),
  new THREE.MeshStandardMaterial({
    map: roofTexture,
    normalMap: roofLineTexture
  })
);
roof.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
);
roof.position.y = 4;
roof.rotation.y = Math.PI / 4;

// door

// door texture
const doorTexture = textureLoader.load("/image/door.jpgg");
const door = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1.4, 2, 0.01),
  new THREE.MeshStandardMaterial({ map: doorTexture })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.castShadow = true
door.position.set(0, 1, 3);

// bushGroup
for (let i = 0; i < 8; i++) {
  // bush
  const bushMaterial = new THREE.MeshStandardMaterial({ color: "#20a162" });
  const bush_big = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 6, 6),
    bushMaterial
  );
  const bush_small = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 5, 5),
    bushMaterial
  );
  bush_small.position.set(0.7, -0.3, 0.4);
  const bush_middle = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.7, 5, 5),
    bushMaterial
  );
  bush_middle.position.set(-0.8, -0.2, 0.3);
  bush_big.castShadow = true;
  // bush_middle.castShadow = true;
  // bush_small.castShadow = true;
  // bushGroup
  const bushGroup = new THREE.Group();
  bushGroup.add(bush_big, bush_small, bush_middle);
  bushGroup.castShadow = true
  const angle = Math.random() * Math.PI * 2;
  const radius = 4 + Math.random() * 5;
  let variableX = Math.sin(angle) * radius;
  let variableZ = Math.cos(angle) * radius;
  bushGroup.position.x = variableX;
  bushGroup.position.z = variableZ;
  bushGroup.position.y = Math.random() * 0.4 + (0.5 - 0.4);
  scene.add(bushGroup);
}

// Group of house
const house = new THREE.Group();
house.add(wall, roof, door);
roof.castShadow = true
house.castShadow = true;
scene.add(house);

/* Lights */
/* Lights need MeshStandardMaterial() can be have effect */

// AmbientLight()
const ambientLight = new THREE.AmbientLight("#21373d");
ambientLight.intensity = 0.2;
scene.add(ambientLight);

// PointLight()
const pointLight = new THREE.PointLight("#525288", 0.5);
pointLight.position.set(0, 8, 5);
scene.add(pointLight);

/* Let Light can casting shadow */
pointLight.castShadow = true;

/* setting shadow quality use to render */
// pointLight.shadow.mapSize.set(1024,1024)
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

/* setting shadow blur radius */
pointLight.shadow.radius = 40;

// doorLight
const doorLight = new THREE.PointLight("#ffa60f", 1, 8);
doorLight.position.set(0, 3.15, 3.15);
doorLight.castShadow = true
house.add(doorLight);

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
renderer.setClearColor("#262837");

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
