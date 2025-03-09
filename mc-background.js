import * as THREE from '//unpkg.com/three/build/three.module.js';

let textureLoaded = 0;
const loading = document.querySelector('.loading');
const loadinfo = document.querySelector('.loadinfo');
const rangeblock = document.querySelector('.rangeblock');

// 删除导致无限循环的 while 代码块
//img-choose
const img_key = [
  "2412",
  "2501",
];

const currentDate = new Date();
const hours = currentDate.getHours();
var theme = "day";
if (hours <= 7 || hours > 18) {
  theme = "night";
}
const img_date = img_key[Math.floor(Math.random() * img_key.length)];


const velocity = 0.0004;

// 加载纹理
window.addEventListener('DOMContentLoaded', () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 渲染器
  const renderer = new THREE.WebGLRenderer();
  THREE.ColorManagement.legacyMode = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.gammaOutput = false;
  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  document.body.appendChild(renderer.domElement);

  // 创建绘图
  const geometry = new THREE.PlaneGeometry(3, 3); // 平面的宽度和高度
  const textureLoader = new THREE.TextureLoader();
  function loadMaterial(n) {
    return new THREE.MeshBasicMaterial({
      map: textureLoader.load(`./panorama/${img_date}_${theme}_${n}.png`, () => {
        textureLoaded++;
        // 每次加载完成更新进度
        loadinfo.innerHTML = `loading texture... ${textureLoaded}/6`;
        rangeblock.style.width = `${(textureLoaded / 6) * 100}%`;
        if(textureLoaded === 6) {
          setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
              loading.style.display = 'none';
            }, 1000); // 等待渐隐动画完成
          }, 1000); // 加载完成后等待1秒
        }
      }),      
      color: new THREE.Color(0xffffff).multiplyScalar(0.5),
    });
  }
  const materialFront = loadMaterial(0);
  const front = new THREE.Mesh(geometry, materialFront);
  scene.add(front);

  const materialRight = loadMaterial(1);
  const left = new THREE.Mesh(geometry, materialRight);
  left.rotation.y = -Math.PI / 2;
  left.position.x = 1.5;
  left.position.z = 1.5;
  scene.add(left);

  const materialBack = loadMaterial(2);
  const back = new THREE.Mesh(geometry, materialBack);
  back.rotation.y = Math.PI;
  back.position.z = 3;
  scene.add(back);

  const materialLeft = loadMaterial(3);
  const right = new THREE.Mesh(geometry, materialLeft);
  right.rotation.y = Math.PI / 2;
  right.position.x = -1.5;
  right.position.z = 1.5;
  scene.add(right);

  const materialUp = loadMaterial(4);
  const top = new THREE.Mesh(geometry, materialUp);
  top.rotation.x = Math.PI / 2;
  top.position.z = 1.5;
  top.position.y = 1.5;
  scene.add(top);

  const materialDown = loadMaterial(5);
  const bottom = new THREE.Mesh(geometry, materialDown);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.z = 1.5;
  bottom.position.y = -1.5;
  scene.add(bottom);

  // 相机设置
  camera.position.z = 1.5;

  // 计划动画
  const animate = () => {
    requestAnimationFrame(animate);

    camera.rotation.y -= velocity;
    renderer.render(scene, camera);
  };

  animate();
});
