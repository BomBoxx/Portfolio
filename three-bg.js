const canvas = document.getElementById("bg-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// PARTICLES
const geometry = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: 0.02,
  color: 0x6366f1
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

// SCROLL EFFECT
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  particles.rotation.x = scrollY * 0.0003;
  camera.position.z = 5 + scrollY * 0.001;
});

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
