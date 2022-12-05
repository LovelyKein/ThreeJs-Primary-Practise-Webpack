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

const canvas = document.getElementById("display");

const scene = new THREE.Scene();

/* 3D Physics Libraries */
// 1. Ammo.js
// 2. Cannon.js    npm install cannon --save
// 3. Oimo.js

/* Objects */
// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(40, 40),
  new THREE.MeshStandardMaterial()
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

/* Physics */
import CANNON from "cannon";
const world = new CANNON.World();
// 提升性能的配置
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
// Add Gravity
world.gravity.set(0, -9.8, 0);

/* axesHelper */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/* Lights */
const ambientLight = new THREE.AmbientLight("#ffffff");
ambientLight.intensity = 0.5;
scene.add(ambientLight);
const pointLight = new THREE.PointLight("#ffffff");
pointLight.intensity = 0.5;
pointLight.position.set(10, 20, 10);
pointLight.castShadow = true;
pointLight.shadow.radius = 10;
pointLight.shadow.mapSize.set(1024, 1024);
scene.add(pointLight);
const helper = new THREE.PointLightHelper(pointLight, 1);
scene.add(helper);

/* Camera */
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
// Camera position is Necessary and Important
camera.position.set(0, 10, 10);
const renderer = new THREE.WebGLRenderer({
  canvas,
  // Let canvas background is Transparent !
  // alpha: true,
});
renderer.setSize(size.width, size.height);
// Use Device pixelRatio,Make Cube More smooth
renderer.setPixelRatio(window.devicePixelRatio);
// Let container color of all
// renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;

/* OrbitControl */
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

// mousemove event
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = event.clientY / size.height - 0.5;
  // const positionX = cursor.x;
  // const positionY = -cursor.y;
});

/* Hit Sound*/
const hitSound = new Audio("/sound/sound.mp3");
const playSound = (collision) => {
  // collision 是 sphereBody 碰撞触发的函数传过来的参数
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  console.log(impactStrength);
  if (impactStrength > 2.5) {
    // 每次碰撞都从头播放音效
    hitSound.currentTime = 0;
    hitSound.play();
    // 更据冲击强度影响音量
    hitSound.volume = impactStrength > 10 ? 1 : impactStrength * 0.1;
  }
};

/* Use a Function to Create Sphere */
window.addEventListener("click", () => {
  createSphere(Math.random() * (1 - 0.2) + 0.2, {
    x: (Math.random() - 0.5) * 8,
    y: 8,
    z: (Math.random() - 0.5) * 8,
  });
});
// CANNON Material
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // 摩擦力
    restitution: 0.6, // 弹力
  }
);
// 默认地面的 position.y = 0
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  material: defaultMaterial,
});
floorBody.addShape(floorShape);
// 纠正方向，因为 three 的 plane 是经过旋转的；
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);
// add into world
world.addContactMaterial(defaultContactMaterial);
// THREE material
const sphereMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.3,
  metalness: 0.1,
  // flatShading: true,
  color: "#ffffff",
});
// THREE sphere
const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const series = []; //用来在帧动画中更新位置；
function createSphere(radius, position) {
  // CANNON.js SphereBody
  const sphereBody = new CANNON.Body({
    mass: 1, // 质量
    shape: new CANNON.Sphere(radius),
    // position: new CANNON.Vec3(0, 5, 0),
    material: defaultMaterial,
  });
  sphereBody.position.copy(position);
  sphereBody.addEventListener("collide", playSound);
  // applyLocalForce(力量的矢量, 施加力量给物体的哪个点)
  // sphereBody.applyLocalForce(
  //   new CANNON.Vec3(400, 0, 0),
  //   new CANNON.Vec3(0, 0, 0)
  // );
  // applyForce(力量的矢量, 在世界的哪个点施加力量)
  // sphereBody.applyForce(new CANNON.Vec3(-100, 0, 0), sphereBody.position); // 只施加一次
  // add into world
  world.addBody(sphereBody);
  // THREE sphere
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(position);
  sphere.scale.set(radius, radius, radius);
  sphere.castShadow = true;
  scene.add(sphere);
  series.push({
    sphere,
    sphereBody,
  });
}

const clock = new THREE.Clock();
let oldTime = 0;
// animation is here
const frame = () => {
  let elapseTime = clock.getElapsedTime();
  // augmentTime 是每一帧流逝的时间；
  let augmentTime = elapseTime - oldTime;
  oldTime = elapseTime;

  // updata Physics World
  // 规定物理世界每一步的时间大小；
  // 后面两个参数为可选；
  world.step(1 / 60, augmentTime, 3);
  // 将显示的 sphere 和 物理世界的 sphereBody 的参数关联起来；
  /* 球体用 position ，方块要用 quaternion，因为方块不是滚动 */
  for (let item of series) {
    item.sphere.position.copy(item.sphereBody.position);
  }

  // 写在帧动画里，此时每一帧都会有一个负 x 轴向的世界力施加在物体上
  // sphereBody.applyForce(new CANNON.Vec3(-1, 0, 0), sphereBody.position);

  // update controls
  controls.update();
  // Start render
  renderer.render(scene, camera);

  // this function will Called every frame
  window.requestAnimationFrame(frame);
};
frame();
