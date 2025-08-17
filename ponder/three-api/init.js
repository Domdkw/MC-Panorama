const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
});
const geometry = new THREE.BoxGeometry();
const textureLoader = new THREE.TextureLoader();
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 添加全局光照
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const pointLight = new THREE.PointLight(0xffffff, 2.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);
