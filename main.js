import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5,5,5);
scene.add(light);

// 🌍 EARTH
const loader = new THREE.TextureLoader();
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 64, 64),
  new THREE.MeshStandardMaterial({
    map: loader.load("images/earth.jpg"),
  })
);
scene.add(earth);

// 🔄 RING GROUP
const ringGroup = new THREE.Group();
scene.add(ringGroup);

// IMPORTANT: tilt like reference
ringGroup.rotation.x = Math.PI / 3.2;

// 🖼️ IMAGES
const images = [
  'images/2150804317.jpg',
  'images/52fede5b44dfee94f976b8fa8b840426.jpg',
  'images/70872216903dc3d9f4e8eebafd41afb1.jpg',
  'images/Image-2.png',
  'images/Image-3.png',
  'images/delicious-ice-cream-with-berries (1).jpg',
  'images/delicious-ice-cream-with-topping (1).jpg',
  'images/delicious-ice-cream-with-topping.jpg',
  'images/war-tank-dark-style.jpg'
];

const radius = 2.8;

images.forEach((src, i) => {
  const angle = (i / images.length) * Math.PI * 2;

  const texture = loader.load(src);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.7),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
  );

  // POSITION (circle)
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  mesh.position.set(x, 0, z);

  // 👉 CRITICAL FIX: tangent rotation (belt style)
  mesh.rotation.y = -angle + Math.PI / 2;

  // 👉 DEPTH LAYERING (front/back illusion)
  mesh.renderOrder = z > 0 ? 1 : 0;

  ringGroup.add(mesh);
});

// 🔥 GOLD RING (visual guide like your image)
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(radius, 0.03, 16, 200),
  new THREE.MeshBasicMaterial({ color: 0xffcc88 })
);
ring.rotation.x = Math.PI / 3.2;
scene.add(ring);

// 🎬 ANIMATION
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0015;

  // smooth orbit
  ringGroup.rotation.y += 0.004;
  ring.rotation.y += 0.004;

  renderer.render(scene, camera);
}

animate();

// 📱 RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});