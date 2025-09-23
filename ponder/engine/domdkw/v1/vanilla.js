const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
});
const geometry = new THREE.BoxGeometry();
camera.position.set(12, 9, 10);
camera.lookAt(0, 0, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.45;
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});












let MCTextureMap;
THREE.Cache.enabled = true;


(async()=>{//等待THREE.LoadingManager加载完成
  const index = window.Process.loader.indexes;
  if(!index) return;
  window.MCTextureMap = await loadFile('/ponder/'+index, 'json', true, `<span class="file-tag mr y">vanilla.js</span>=><span class="file-tag mr ml y">${index}</span>加载贴图映射文件`)
  startPreload();
  // CreateBase(0) 已经在 startPreload 中调用
})();
// 定义 MCTextureLoader 类
const MCTextureLoader = {
  load(block){
    // 检查 MCTextureMap 是否已定义且包含该方块
    if(block in window.MCTextureMap){
      switch (window.MCTextureMap[block].type) {
        case 6:
          // 对于类型6，直接返回贴图
          if (loadedTexture[block]) {
            return loadedTexture[block];
          } else {
            console.warn(`未找到贴图 ${block}，当前已加载的贴图:`, Object.keys(loadedTexture));
            return null;
          }
        case 'x':
          // 对于类型'x'，直接返回贴图
          if (loadedTexture[block]) {
            return loadedTexture[block];
          } else {
            console.warn(`未找到贴图 ${block}，当前已加载的贴图:`, Object.keys(loadedTexture));
            return null;
          }
        case 'd':
          // 对于类型'd'，使用 d 方法处理
          return MCTextureLoader.d(MCTextureMap[block].map, block);
        default:
          // 默认情况，尝试返回贴图
          if (loadedTexture[block]) {
            return loadedTexture[block];
          } else {
            console.warn(`未找到贴图 ${block}，当前已加载的贴图:`, Object.keys(loadedTexture));
            return null;
          }
      }
    }
    
    // 如果没有找到贴图，返回 null
    console.warn(`方块 ${block} 不在贴图映射中`);
    return null;
  },
  
  d(map, block) {
    // 对于类型"d"，map是一个数组，需要特殊处理
    // 这里假设数组的第一个元素是顶面贴图，第二个是侧面贴图
    if (Array.isArray(map) && map.length >= 2) {
      // 在实际实现中，可能需要创建一个组合贴图或者返回特定的贴图
      // 目前我们返回第一个贴图作为示例
      if (loadedTexture[block]) {
        return loadedTexture[block];
      } else {
        console.warn(`未找到贴图 ${block}，当前已加载的贴图:`, Object.keys(loadedTexture));
        return null;
      }
    }
    // 如果不是预期的数组格式，直接返回
    return map;
  }
}

const LoadingManager = new THREE.LoadingManager();
const TextureLoader = new THREE.TextureLoader(LoadingManager);

LoadingManager.onLoad = () => {
  console.log('所有资源加载完成');
  setTimeout(() => {
    loadingDiv.style.opacity = '0';
    setTimeout(() => {
      loadingDiv.style.display = 'none';
      // 在 loadingDiv 完全隐藏后再执行 CreateBase 和 fragmentPlay.next
      if (texturesLoaded) {
        CreateBase(0);
        fragmentPlay.next(0);
      }
    }, 1000);
  }, 1000);
  //initGUI();
};
const {loadinfo:lmopli, rangeblock:lmoprb} = SNLB('lm-op', true);
LoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  lmopli.innerHTML = `<span class="file-tag y">THREE.LoadingManager</span>: 已加载${itemsLoaded}个资源，共${itemsTotal}个资源`;
  lmoprb.style.width = Math.round((itemsLoaded/itemsTotal)*100) + '%';
};
LoadingManager.onError = (url) => {console.error(`加载错误: ${url}`);};

// 预加载贴图
let loadedTexture = {};
let textureUrl = {};
let texturesLoaded = false;
let textureLoadPromises = [];
function startPreload() {
  const needBlock = window.Process.loader.block;
  if(needBlock){
    for (const block of needBlock) {
      console.log('预加载', block);
      if(!(block in window.MCTextureMap)) {//如果方块不在贴图映射中
        console.warn(`方块 ${block} 不在贴图映射中`);
        continue;
      }
      const blockName = block.split(':')[1];//取:后字段
      // 只存储带命名空间的键名
      textureUrl[block] = '/ponder/minecraft/textures/block/'+blockName+'.png';
    }
  };
  for (const scene of window.Process.scenes) {//遍历场景
    switch (scene.base.default) {
      case 'create':
          switch(scene.base.create.style){
            case '5x5white':
              // 只存储带命名空间的键名
              textureUrl['minecraft:white_concrete_powder'] = '/ponder/minecraft/textures/block/white_concrete_powder.png';
              textureUrl['minecraft:light_gray_concrete_powder'] = '/ponder/minecraft/textures/block/light_gray_concrete_powder.png';
              break;
          }
        break;
    }
  }
  // 创建所有贴图加载的 Promise
  textureLoadPromises = Object.entries(textureUrl).map(([block, url]) => {
    return new Promise((resolve) => {
      TextureLoader.load(url, (texture) => {
        loadedTexture[block] = texture;
        resolve();
      }, undefined, (error) => {
        console.error(`贴图 ${block} 加载失败:`, error);
        resolve(); // 即使失败也resolve，避免Promise.all被卡住
      });
    });
  });
  
  // 等待所有贴图加载完成
  Promise.all(textureLoadPromises).then(() => {
    texturesLoaded = true;
    console.log('所有贴图加载完成');
  });
};

//plugins start
function blockFallAnimation(obj, startY) {//方块下落动画
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const progress = Math.min(elapsed * 2, 1);

    obj.position.y = THREE.MathUtils.lerp(startY+1, startY, progress);
    obj.material.opacity = THREE.MathUtils.lerp(0, 1, progress);

    // 使用全局的 renderer 和 scene
    renderer.render(scene, camera);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}
function CreateBase(sceneNum){
  const createBase = window.Process.scenes[sceneNum].base.create;
  //main -style
  if(!createBase.style) return;
  let cx = 0, cy = 0, cz = 0;
  if(createBase.offset){
    cx = createBase.offset.x;
    cy = createBase.offset.y;
    cz = createBase.offset.z;
  }
  switch(createBase.style){//根据style设置base
    case '5x5white':
      const table = [[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1],]
      for (let i = 0; i < table.length; i++) {
        const row = table[i];
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          if(cell === 1){setblock('minecraft:light_gray_concrete_powder', i+cx-2, cy, j+cz-2);}
          else{setblock('minecraft:white_concrete_powder', i+cx-2, cy, j+cz-2);}
        }
      }
      break;
  }
}

//plugins end

//解析流程
const sceneTotal = window.Process.scenes.length;
let fragmentTotal = 0;
console.log(`场景总数: ${sceneTotal}`);
function parseFragment(sceneNum){
  const scene = window.Process.scenes[sceneNum];
  if(!scene) return;
  if(!scene.fragment) return;
  fragmentTotal = scene.fragment.length;
  console.log(`场景${sceneNum}片段总数: ${fragmentTotal}`);
  //删除旧的script
  const oldScript = document.getElementById('ponderScene'+sceneNum);
  if(oldScript) oldScript.remove();
  //解析fragment
  let ffunctions = '';
  for(let i = 0; i < scene.fragment.length; i++){
    let command = '';
    const fragment = scene.fragment[i];
    for(let j = 0; j < fragment.length; j++){
      // 检查是否包含 idle 函数调用
      if(fragment[j].includes('idle(')){
        // 将 idle 调用改为 await idle
        command += 'await ' + fragment[j] + ';\n';
      } else {
        command += fragment[j] + ';\n';
      }
    }
    ffunctions += 'async function ponderFragment'+i+'(){\n'+command+'};\n';
  }
  console.log(ffunctions);
  const script = document.createElement('script');
  script.id = 'ponderScene'+sceneNum;
  script.textContent = ffunctions;
  document.body.appendChild(script);
}
//片段切换
let defaultScene = -1, defaultFragment = 0, fragmentCurrent = defaultFragment, sceneCurrent = defaultScene;
const fragmentPlay = {
  async next(){
    fragmentCurrent++;
    //if(sceneCurrent >= sceneTotal) return;
    if(fragmentCurrent >= fragmentTotal){
      fragmentCurrent = 0;
      sceneCurrent++;
      parseFragment(sceneCurrent);
    }
    console.log(fragmentCurrent+1,'/',fragmentTotal);
    if(fragmentCurrent < fragmentTotal){
      console.log(`第${sceneCurrent}片段，执行ponderFragment${fragmentCurrent}函数`);
      await window['ponderFragment'+fragmentCurrent]();
    }
  },
  async prev(){
    fragmentCurrent--;
    if(fragmentCurrent < 0){
      fragmentCurrent = fragmentTotal-1;
      sceneCurrent--;
      parseFragment(sceneCurrent);
    }
    console.log(fragmentCurrent+1,'/',fragmentTotal);
    if(fragmentCurrent < fragmentTotal){
      console.log(`第${sceneCurrent}片段，执行ponderFragment${fragmentCurrent}函数`);
      await window['ponderFragment'+fragmentCurrent]();
    }
  }
}

//setblock
function setblock(block, x, y, z){
  const texture = MCTextureLoader.load(block);
  
  // 创建材质，确保贴图存在
  const material = new THREE.MeshBasicMaterial({
    transparent: false,
    opacity: 1,
    color: 0xffffff // 默认白色，让贴图颜色显示正常
  });
  
  // 只有当贴图存在时才设置 map 属性
  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false; // 禁用mipmap，进一步避免模糊
    material.map = texture;
  } else {
    console.warn(`方块 ${block} 的贴图未找到，使用默认颜色`);
    material.color = new THREE.Color(0xff0000); // 使用红色作为默认颜色，更容易发现问题
  }
  
  const blockObj = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
  );
  blockObj.position.set(x, y, z);
  
  // 为方块添加一个名称属性，便于调试
  blockObj.name = block;
  
  scene.add(blockObj);
  
  renderer.render(scene, camera);// 强制渲染更新
}

// idle 函数：等待指定秒数
function idle(seconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

// setblockfall 函数：放置方块并添加下落动画
function setblockfall(block, x, y, z) {
  const texture = MCTextureLoader.load(block);
  
  // 创建材质，确保贴图存在
  const material = new THREE.MeshBasicMaterial({
    transparent: true, // 需要透明度支持动画效果
    opacity: 0, // 初始透明度为0
    color: 0xffffff // 默认白色，让贴图颜色显示正常
  });
  
  // 只有当贴图存在时才设置 map 属性
  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false; // 禁用mipmap，进一步避免模糊
    material.map = texture;
  } else {
    console.warn(`方块 ${block} 的贴图未找到，使用默认颜色`);
    material.color = new THREE.Color(0xff0000); // 使用红色作为默认颜色，更容易发现问题
  }
  
  const blockObj = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
  );
  blockObj.position.set(x, y, z);
  
  // 为方块添加一个名称属性，便于调试
  blockObj.name = block;
  
  scene.add(blockObj);
  
  // 调用下落动画函数
  blockFallAnimation(blockObj, y);
  
  renderer.render(scene, camera); // 强制渲染更新
}
