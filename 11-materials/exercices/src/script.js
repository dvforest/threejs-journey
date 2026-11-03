import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * User Interface
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg",
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg",
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg",
);
const matcapTexture = textureLoader.load("./textures/matcaps/2.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Meshes
 */

// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

const material = new THREE.MeshStandardMaterial();
material.roughness = 1;
material.metalness = 1;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.roughnessMap = doorRoughnessTexture;
material.metalnessMap = doorMetalnessTexture;
material.normalMap = doorNormalTexture;
material.alphaMap = doorAlphaTexture;
material.transparent = true;
gui.add(material, "roughness").min(0).max(1).step(0.001);
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "displacementScale").min(0).max(5).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75, 64, 64, 64),
  material,
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.4, 64, 128),
  material,
);
sphere.position.x = 1.5;
torus.position.x = -1.5;

scene.add(sphere, box, torus);

/**
 * Lights
 */

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 10);
// pointLight.position.x = 2;
// pointLight.position.y = 2;
// pointLight.position.z = 0;
// scene.add(pointLight);

/**
 * Environment Map
 */

const loader = new RGBELoader();
const envMap = await loader.loadAsync("./textures/environmentMap/2k.hdr");
envMap.mapping = THREE.EquirectangularReflectionMapping;

scene.environment = envMap;
scene.background = envMap;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  sphere.rotation.y = 0.1 * elapsedTime;
  box.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  box.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
