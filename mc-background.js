import * as THREE from '//unpkg.com/three/build/three.module.js';

//img-choose
const imgBatch = [
  "2412",
  "2501",
];
const imgLink = [
  {"url":'https://i.postimg.cc'},{'2412-day-0.png':'wB0z0pYJ'},{'2412-day-1.png':'sfBBQn5K'},{'2412-day-2.png':'L4rJzzTS'},{'2412-day-3.png':'QCWr8K9k'},{'2412-day-4.png':'Tw16s4Ts'},{'2412-day-5.png':'wvrpYQvj'},{'2412-night-0.png':'hhWRf4VF'},{'2412-night-1.png':'NjtLnBSP'},{'2412-night-2.png':'8zbsQxVk'},{'2412-night-3.png':'nLcrHTH4'},{'2412-night-4.png':'xTMcgcxz'},{'2412-night-5.png':'QM4tV5tR'},{'2501-day-0.png':'hjXGmjQh'},{'2501-day-1.png':'x8HTs4R2'},{'2501-day-2.png':'Px05Qj1y'},{'2501-day-3.png':'9F5f4cmF'},{'2501-day-4.png':'DfbZySKM'},{'2501-day-5.png':'QdSNn5pH'},{'2501-night-0.png':'QxQd1vCg'},{'2501-night-1.png':'htKPrMQk'},{'2501-night-2.png':'rpmy6mJg'},{'2501-night-3.png':'bJSzJB4t'},{'2501-night-4.png':'N0zsQcCt'},{'2501-night-5.png':'5ycfFmMk'},
];
const hours = new Date().getHours();
var theme = "day";
if (hours <= 7 || hours > 18) {
  theme = "night";
}
const imgDate = imgBatch[Math.floor(Math.random() * imgBatch.length)];
const imgDomain = 1;

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
    let imgUrl = null;
    if (imgDomain === 0) {
      imgUrl = `./panorama/${imgDate}_${theme}_${n}.png`;
    } else {
      const baseUrl = imgLink[0].url; 
      const fileName = `${imgDate}-${theme}-${n}.png`;
      let hash = '';
      for (let i = 1; i < imgLink.length; i++) {
        if (imgLink[i][fileName]) {
          hash = imgLink[i][fileName];
          break;
        }
      }
      imgUrl = `${baseUrl}/${hash}/${fileName}`;
    }
    return new THREE.MeshBasicMaterial({
      map: textureLoader.load(imgUrl, () => {
        fileLoaded++;
        loadinfo.innerHTML = `loading texture... ${fileLoaded}/6`;
        rangeblock.style.width = `${(fileLoaded / 6) * 100}%`;
        if(fileLoaded === 6) {
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
