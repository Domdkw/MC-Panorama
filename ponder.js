window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
}
function initRenderer() {
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
}
function setupCubeAnimation(obj, startY) {
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const progress = Math.min(elapsed * 2, 1);

    obj.position.y = THREE.MathUtils.lerp(startY+1, startY, progress);
    obj.material.opacity = THREE.MathUtils.lerp(0, 1, progress);

    renderer.render(scene, camera);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}


function mcBlock(position = {x:0, y:0, z:0}) {
  const geometry = new THREE.BoxGeometry();
  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load('andesite_casing.png'),
    transparent: true,
    opacity: 0
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  scene.add(cube);

  setupCubeAnimation(cube, position.y);
  return cube;
}


function init() {
  initScene();
  initRenderer();
  
  // 添加全局光照
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  const pointLight = new THREE.PointLight(0xffffff, 2.5);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight, ambientLight);

  mcBlock({x: 0, y: 0, z: 0});
}
init();
