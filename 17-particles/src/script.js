import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesAlpha = textureLoader.load("/textures/particles/2.png");

/**
 * Particles
 */
const particlesData = {
  x: 4,
  y: 0.5,
  z: 4,
  count: 100000,
};
const particlesPositions = new Float32Array(particlesData.count * 3);
const particlesColor = new Float32Array(particlesData.count * 3);

for (let i = 0; i < particlesData.count; i++) {
  const x = (Math.random() - 0.5) * particlesData.x;
  const y = (Math.random() - 0.5) * particlesData.y;
  const z = (Math.random() - 0.5) * particlesData.z;
  particlesPositions[i * 3] = x;
  particlesPositions[i * 3 + 1] = y;
  particlesPositions[i * 3 + 2] = z;
  particlesColor[i * 3] = Math.random();
  particlesColor[i * 3 + 1] = Math.random();
  particlesColor[i * 3 + 2] = Math.random();
}
const particlesGeometry = new THREE.BufferGeometry();

console.log(particlesColor);
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particlesPositions, 3),
);
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(particlesColor, 3),
);
const particlesMaterial = new THREE.PointsMaterial({
  color: "#FFC5D3",
  size: 0.01,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: particlesAlpha,
  alphaTest: 0.01,
  depthWrite: false,
  // blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
  0.001,
  100,
);
camera.position.z = 3;
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

  // Particles Animation
  for (let i = 0; i < particlesData.count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3 + 0];
    particlesGeometry.attributes.position.array[i3 + 1] =
      Math.sin(elapsedTime + x * 5) * 0.1;
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
