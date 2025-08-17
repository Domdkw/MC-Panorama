//RTT
function RTT(url, timeout = 5000) {
  return new Promise((resolve) => {
    let img = new Image();
    const st = performance.now();
    let isTimeout = false;
    const cleanup = () => {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      img = null;
    };
    img.onload = () => {
      if (isTimeout) return;
      const et = performance.now();
      const rtt = et - st;
      resolve(rtt);
      cleanup();
    };
    img.onerror = () => {
      if (isTimeout) return;
      resolve(-1);
      cleanup();
    };
    const timer = setTimeout(() => {
      isTimeout = true;
      resolve(-1);
      cleanup();
    }, timeout);
    img.src = '//'+url+'/favicon.ico';
  })
}
//img-choose
//mirror
const imgMirror = ['i.postimg.cc'];
let imgDomain = 0, minImgRTT = -1;

// 修改后的镜像检测逻辑
const promises = imgMirror.map((url, index) => 
  RTT(url).then(rtt => {
    // 原子化更新最小值
    if (rtt > 0) {
      performance.mark(`mirror-test-${index}`);
      const currentMin = minImgRTT;
      if (currentMin === -1 || rtt < currentMin) {
        minImgRTT = rtt;
        imgDomain = index + 1; // 索引从1开始
      }
      performance.measure(`mirror-${index}`, `mirror-test-${index}`);
    }
    return { index, rtt };
  })
);

// 将函数定义提升到文件顶部
function loadMcPanorama() {
  const {loadstate, loadinfo, rangeblock} = SNLB('texture', true);
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

  loadinfo.innerHTML = 'loading texture... ';
  rangeblock.style.width = '0%';

  // 创建绘图
  const geometry = new THREE.PlaneGeometry(3, 3); // 平面的宽度和高度
  const textureLoader = new THREE.TextureLoader();
  function loadMaterial(n) {
    let imgUrl = null;
    if (imgDomain === 0) {
      imgUrl = `./panorama/${imgDate}_${theme}_${n}.png`;
    } else {
      const imgBatchToNum = {"2412": 0, "2501": 1, "2502":2, "create":3,};
      const themeToNum = {"day": 0, "night": 1};
      let imgOutlinkKey = null;
      if(imgDate === "2501" || imgDate === "2412") {
        imgOutlinkKey = imgLink[imgDomain-1][ imgBatchToNum[imgDate] * 12 + themeToNum[theme]*6 + n+1 ];
      } else {
        imgOutlinkKey = imgLink[imgDomain-1][ imgBatchToNum[imgDate] * 6 + 12 + n+1 ];
      }
      imgUrl = `${imgLink[imgDomain-1][0]}/${imgOutlinkKey}/${imgDate}-${theme}-${n}.png`;
    }
    return new THREE.MeshBasicMaterial({
      map: textureLoader.load(imgUrl, () => {
        fileLoaded++;
        loadinfo.innerHTML = `loading texture... ${fileLoaded}/6`;
        rangeblock.style.width = `${(fileLoaded / 6) * 100}%`;
        if(fileLoaded === 6) {
          loadstate.style.backgroundColor = '#fff6';
          setTimeout(() => {
            loadingDiv.style.opacity = '0';
            setTimeout(() => {
              loadingDiv.style.display = 'none';
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
};

// 修改 Promise.allSettled 的回调部分
// 增强兜底逻辑
Promise.allSettled(promises).then(results => {
  const validResults = results
    .filter(r => r.status === 'fulfilled' && r.value.rtt > 0)
    .map(r => r.value);

  if (validResults.length === 0) {
    console.warn('All mirrors failed, using local resources');
    imgDomain = 0;
    minImgRTT = -1;
  } else {
    // 找到响应最快的镜像
    const fastest = validResults.reduce((prev, current) => 
      current.rtt < prev.rtt ? current : prev
    );
    imgDomain = fastest.index + 1;
    minImgRTT = fastest.rtt;
  }
  const {loadinfo}= SNLB('img', false);
  loadinfo.innerHTML = `<span class="file-tag y mr">mc-background.js</span>=>imgMirror: ${imgDomain}, imgDate: ${imgDate}, theme: ${theme}`;

});

const imgBatch = [
  "2412",
  "2501",
  "2502",
  "create",
];
const imgLink = [
  ["https://i.postimg.cc",'wB0z0pYJ','sfBBQn5K','L4rJzzTS','QCWr8K9k','Tw16s4Ts','wvrpYQvj','hhWRf4VF','NjtLnBSP','8zbsQxVk','nLcrHTH4','xTMcgcxz','QM4tV5tR','hjXGmjQh','x8HTs4R2','Px05Qj1y','9F5f4cmF','DfbZySKM','QdSNn5pH','QxQd1vCg','htKPrMQk','rpmy6mJg','bJSzJB4t','N0zsQcCt','5ycfFmMk',
    'MHk38znj','SxZZx6X4','WbvYWbRB','2y4ckgW9','05mH0K4G','ZKx71t4C','sgf6z6gK','ydRnj2L6','KjyfHQWP','66dYvJ7Y','0NbVMzmw','GtJKwG0Z',
]
];
const imgDate = imgBatch[Math.floor(Math.random() * imgBatch.length)];// 0: 2412 1: 2501 2: 2502 3: create
const hours = new Date().getHours();
var theme = "null";
if (imgDate === "2412" || imgDate === "2501") {
  if (hours <= 7 || hours > 18) {
    theme = "night";
  }else{
    theme = "day"; 
  }
}
//imgDomain = 0; // 0: 本地 1: 远程;
const velocity = 0.0004;