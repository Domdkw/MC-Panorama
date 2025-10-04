const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.45;
renderer.domElement.style.zIndex = '10'; // 设置高于背景画布的z-index(mcbackground)
const scene = new THREE.Scene();
scene.background = null; // 设置为null以使用透明背景
renderer.setClearColor(0x000000, 0.5); // 设置半透明黑色清除颜色
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
const geometry = new THREE.BoxGeometry();
camera.position.set(12, 10, 10);
camera.lookAt(0, 0, 0);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//场景设置



let MCTextureMap;
THREE.Cache.enabled = true;


(async()=>{//等待THREE.LoadingManager加载完成
  const index = window.Process.loader.indexes;
  if(!index) return;
  let [, mtm] = await Promise.all([
    loadTHREECSS2DRenderer(),
    loadFile(index, 'json', true, `<span class="file-tag mr y">vanilla.js</span>=><span class="file-tag mr ml y">${index}</span>加载贴图映射文件`)
  ])
  window.MCTextureMap = mtm;
  startPreload();
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
// 加载管理器
const LoadingManager = new THREE.LoadingManager();
const TextureLoader = new THREE.TextureLoader(LoadingManager);
LoadingManager.onLoad = () => {//主要加载步骤
  // 加载完成后，渲染 CSS2D 元素
  console.log('renderCSS2D...');
  window.CSS2DRenderer = new window.CSS2DRenderer(renderer);

  console.log('所有资源加载完成');
  setTimeout(async () => {
    loadingDiv.style.opacity = '0';
    CreateBase(defaultScene);
    setTimeout(async () => {
      loadingDiv.style.display = 'none';
      // 在 loadingDiv 完全隐藏后再执行 CreateBase 和 fragmentPlay.next
      if (texturesLoaded) {
        await fragmentPlay.next(defaultFragment);
      }
    }, 1000);
  }, 1000);
};
const {loadinfo:lmopli, rangeblock:lmoprb} = SNLB('lm-op', true);
lmopli.innerHTML = '<span class="file-tag y">THREE.LoadingManager</span>: 等待启动加载';
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
  for (const scene of window.Process.scenes) {//遍历场景,根据base设置预加载贴图
    switch (scene.base.default) {
      case 'create':
          switch(scene.base.create.style){
            case '5x5chessboard':
              // 只存储带命名空间的键名
              textureUrl['minecraft:white_concrete'] = '/ponder/minecraft/textures/block/white_concrete.png';
              textureUrl['minecraft:light_gray_concrete'] = '/ponder/minecraft/textures/block/light_gray_concrete.png';
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

// plugins start
function CreateBase(sceneNum){//创建CreateBase场景
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
    case '5x5chessboard':
      const table = [[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1],]
      for (let i = 0; i < table.length; i++) {
        const row = table[i];
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          if(cell === 1){setblock('minecraft:white_concrete', i+cx-2, cy, j+cz-2);}
          else{setblock('minecraft:light_gray_concrete', i+cx-2, cy, j+cz-2);}
        }
      }
      break;
  }
}
// Ease in out 缓动函数
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
//plugins end

const ffawait = ['idle(', 'tip(','moveCamera(false', 'cleanscene(false', 'tiparea('];

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
      // 检查是否包含函数调用
      const isAsyncCall = ffawait.some(func => {
        // 使用正则表达式检查是否包含函数调用，更灵活的匹配方式
        // 匹配函数名后跟括号的形式，允许前面有空格或其他字符
        const regex = new RegExp(`\\b${func.replace('(', '\\s*\\(')}`);
        return regex.test(fragment[j].trim());
      });
      if(isAsyncCall){
        // 将 idle 或 tip 调用改为 await
        command += 'await ' + fragment[j] + ';\n';
      } else {
        command += fragment[j] + ';\n';
      }
    }
    ffunctions += 'async function ponderFragment'+i+'(){\n'+command+'};\n';
  }
  const script = document.createElement('script');
  script.id = 'ponderScene'+sceneNum;
  script.textContent = ffunctions;
  document.body.appendChild(script);
}

//片段切换
let defaultScene = 0, defaultFragment = 0, fragmentCurrent = defaultFragment, sceneCurrent = defaultScene-1;
const fragmentPlay = {
  async next(){
    fragmentCurrent++;
    //if(sceneCurrent >= sceneTotal) return;
    if(fragmentCurrent >= fragmentTotal){
      fragmentCurrent = 0;
      sceneCurrent++;
      parseFragment(sceneCurrent);
    }
    console.log('片段'+fragmentCurrent+1+'/'+fragmentTotal);
    if(fragmentCurrent < fragmentTotal){
      console.log(`第${sceneCurrent+1}片段，执行ponderFragment${fragmentCurrent}函数`);
      //先计算片段时间
      const fragmentTime = calculatePonderFragmentTime(fragmentCurrent);
      console.log(`第${sceneCurrent+1}片段，预计耗时${fragmentTime}秒`);
      // 执行片段函数
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
    console.log('片段'+fragmentCurrent+1+'/'+fragmentTotal);
    if(fragmentCurrent < fragmentTotal){
      console.log(`第${sceneCurrent+1}片段，执行ponderFragment${fragmentCurrent}函数`);
      
      // 执行片段函数
      await window['ponderFragment'+fragmentCurrent]();
    }
  }
}


// SCENE操作

// idle 函数：等待指定秒数（优化版）
function idle(duration) {
  // 使用更简洁的Promise语法，避免不必要的函数包装
  return new Promise(resolve => setTimeout(resolve, duration * 1000));
}

// 移动方块函数 - 处理位置变化（优化版）
function moveBlock(startX, startY, startZ, targetX, targetY, targetZ, duration) {
  // 使用更高效的查找方法，避免重复遍历
  let blockToMove = null;
  for (let i = 0; i < scene.children.length; i++) {
    const child = scene.children[i];
    if (child.position.x === startX && 
        child.position.y === startY && 
        child.position.z === startZ && 
        child.type === 'Mesh') {
      blockToMove = child;
      break;
    }
  }
  
  if (!blockToMove) {
    console.warn(`在位置 (${startX}, ${startY}, ${startZ}) 未找到方块`);
    return Promise.resolve();
  }
  
  return new Promise(resolve => {
    let startTime = null;
    let animationFrameId = null;
    
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // 应用缓动函数
      const easedProgress = easeInOut(progress);
      
      // 直接更新位置，避免创建临时变量
      blockToMove.position.x = startX + (targetX - startX) * easedProgress;
      blockToMove.position.y = startY + (targetY - startY) * easedProgress;
      blockToMove.position.z = startZ + (targetZ - startZ) * easedProgress;
      
      // 渲染场景
      renderer.render(scene, camera);
      
      // 如果动画未完成，继续更新
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // 动画完成时进行一次最终渲染
        renderer.render(scene, camera);
        resolve();
      }
    }
    
    // 开始动画
    animationFrameId = requestAnimationFrame(animate);
    
    // 添加取消动画的方法，避免内存泄漏
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });
}
// 渐变效果函数 - 处理透明度变化（优化版）
function fadeBlock(x, y, z, startOpacity, endOpacity, duration) {
  // 使用更高效的查找方法
  let blockToFade = null;
  for (let i = 0; i < scene.children.length; i++) {
    const child = scene.children[i];
    if (child.position.x === x && 
        child.position.y === y && 
        child.position.z === z && 
        child.type === 'Mesh') {
      blockToFade = child;
      break;
    }
  }
  
  if (!blockToFade) {
    console.warn(`在位置 (${x}, ${y}, ${z}) 未找到方块`);
    return Promise.resolve();
  }
  
  // 预先设置材质属性，避免在动画循环中重复设置
  if (!blockToFade.material.transparent) {
    blockToFade.material.transparent = true;
  }
  
  return new Promise(resolve => {
    let startTime = null;
    let animationFrameId = null;
    
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // 应用缓动函数
      const easedProgress = easeInOut(progress);
      
      // 直接计算透明度，避免使用THREE.MathUtils.lerp
      blockToFade.material.opacity = startOpacity + (endOpacity - startOpacity) * easedProgress;
      
      // 渲染场景
      renderer.render(scene, camera);
      
      // 如果动画未完成，继续更新
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // 动画完成时进行一次最终渲染
        renderer.render(scene, camera);
        resolve();
      }
    }
    
    // 开始动画
    animationFrameId = requestAnimationFrame(animate);
    
    // 添加取消动画的方法
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });
}

//setblock（优化版）
function setblock(block, x, y, z){
  // 检查目标位置是否已有方块，如果有则先移除
  removeblock(x, y, z);
  
  const texture = MCTextureLoader.load(block);
  
  // 创建材质，使用对象字面量避免重复创建
  const materialOptions = {
    transparent: true,
    opacity: 1,
    color: 0xffffff
  };
  
  // 只有当贴图存在时才设置 map 属性
  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    materialOptions.map = texture;
  } else {
    console.warn(`方块 ${block} 的贴图未找到，使用默认颜色`);
    materialOptions.color = new THREE.Color(0xff0000);
  }
  
  // 重用几何体实例，避免重复创建
  const geometry = getReusableBoxGeometry();
  const material = new THREE.MeshBasicMaterial(materialOptions);
  
  const blockObj = new THREE.Mesh(geometry, material);
  blockObj.position.set(x, y, z);
  blockObj.name = block;
  
  scene.add(blockObj);
  
  // 延迟渲染，避免频繁渲染
  requestAnimationFrame(() => {
    renderer.render(scene, camera);
  });
}

// 可重用的几何体缓存
let reusableBoxGeometry = null;
function getReusableBoxGeometry() {
  if (!reusableBoxGeometry) {
    reusableBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  }
  return reusableBoxGeometry;
}
// setblockfall 函数：放置方块并添加下落动画（优化版）
function setblockfall(block, x, y, z, duration) {
  // 检查目标位置是否已有方块，如果有则先移除
  removeblock(x, y, z);
  
  const texture = MCTextureLoader.load(block);
  
  // 创建材质，使用对象字面量
  const materialOptions = {
    transparent: true,
    opacity: 0,
    color: 0xffffff
  };
  
  // 只有当贴图存在时才设置 map 属性
  if (texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    materialOptions.map = texture;
  } else {
    console.warn(`方块 ${block} 的贴图未找到，使用默认颜色`);
    materialOptions.color = new THREE.Color(0xff0000);
  }
  
  // 重用几何体实例
  const geometry = getReusableBoxGeometry();
  const material = new THREE.MeshBasicMaterial(materialOptions);
  
  const blockObj = new THREE.Mesh(geometry, material);
  blockObj.position.set(x, y + 1, z); // 初始位置在目标位置上方一个单位
  blockObj.name = block;
  
  scene.add(blockObj);
  
  // 返回一个 Promise，同时执行移动和渐变动画
  return Promise.all([
    moveBlock(x, y + 1, z, x, y, z, duration),
    fadeBlock(x, y + 1, z, 0, 1, duration)
  ]);
}
//fill填充（优化版）
function fill(block, x1, y1, z1, x2, y2, z2){
  // 确保坐标范围正确（从小到大）
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  
  // 预先加载纹理，避免重复查找
  const texture = MCTextureLoader.load(block);
  
  // 批量创建方块，减少函数调用次数
  const blocksToAdd = [];
  
  for(let x = minX; x <= maxX; x++){
    for(let y = minY; y <= maxY; y++){
      for(let z = minZ; z <= maxZ; z++){
        // 检查目标位置是否已有方块，如果有则先移除
        removeblock(x, y, z);
        
        // 创建材质
        const materialOptions = {
          transparent: true,
          opacity: 1,
          color: 0xffffff
        };
        
        if (texture) {
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          texture.generateMipmaps = false;
          materialOptions.map = texture;
        } else {
          materialOptions.color = new THREE.Color(0xff0000);
        }
        
        // 重用几何体实例
        const geometry = getReusableBoxGeometry();
        const material = new THREE.MeshBasicMaterial(materialOptions);
        
        const blockObj = new THREE.Mesh(geometry, material);
        blockObj.position.set(x, y, z);
        blockObj.name = block;
        
        blocksToAdd.push(blockObj);
      }
    }
  }
  
  // 批量添加到场景
  blocksToAdd.forEach(blockObj => {
    scene.add(blockObj);
  });
  
  // 延迟渲染，避免频繁渲染
  requestAnimationFrame(() => {
    renderer.render(scene, camera);
  });
}
//fillfall填充（优化版）
function fillfall(block, x1, y1, z1, x2, y2, z2, duration){
  // 确保坐标范围正确（从小到大）
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  
  // 预先加载纹理，避免重复查找
  const texture = MCTextureLoader.load(block);
  
  // 创建一个组来包含所有方块
  const blockGroup = new THREE.Group();
  
  // 计算区域的中心点，用于组的位置
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2 + 1; // 初始位置在目标位置上方一个单位
  const centerZ = (minZ + maxZ) / 2;
  
  // 重用几何体实例
  const geometry = getReusableBoxGeometry();
  
  // 为每个位置创建方块并添加到组中
  for(let x = minX; x <= maxX; x++){
    for(let y = minY; y <= maxY; y++){
      for(let z = minZ; z <= maxZ; z++){
        // 检查目标位置是否已有方块，如果有则先移除
        removeblock(x, y, z);
        
        // 创建材质
        const materialOptions = {
          transparent: true,
          opacity: 0,
          color: 0xffffff
        };
        
        // 只有当贴图存在时才设置 map 属性
        if (texture) {
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          texture.generateMipmaps = false;
          materialOptions.map = texture;
        } else {
          materialOptions.color = new THREE.Color(0xff0000);
        }
        
        const material = new THREE.MeshBasicMaterial(materialOptions);
        const blockObj = new THREE.Mesh(geometry, material);
        
        // 相对于组的位置设置方块位置
        blockObj.position.set(x - centerX, y - (centerY - 1), z - centerZ);
        blockObj.name = block;
        
        blockGroup.add(blockObj);
      }
    }
  }
  
  // 设置组的初始位置
  blockGroup.position.set(centerX, centerY, centerZ);
  
  // 将组添加到场景中
  scene.add(blockGroup);
  
  // 返回一个 Promise，用于执行组的动画
  return new Promise(resolve => {
    let startTime = null;
    let animationFrameId = null;
    
    // 目标位置
    const targetY = centerY - 1; // 下落到目标位置
    
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // 应用缓动函数
      const easedProgress = easeInOut(progress);
      
      // 直接计算位置，避免使用THREE.MathUtils.lerp
      blockGroup.position.y = centerY + (targetY - centerY) * easedProgress;
      
      // 更新组内所有方块的透明度
      const children = blockGroup.children;
      for (let i = 0; i < children.length; i++) {
        const blockObj = children[i];
        if (blockObj.material) {
          blockObj.material.opacity = easedProgress;
        }
      }
      
      // 渲染场景
      renderer.render(scene, camera);
      
      // 如果动画未完成，继续更新
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // 动画完成，将组中的所有方块单独添加到场景中，并移除组
        const blocksToAdd = [];
        const children = blockGroup.children;
        
        for (let i = 0; i < children.length; i++) {
          const blockObj = children[i];
          const worldPosition = new THREE.Vector3();
          blockObj.getWorldPosition(worldPosition);
          blockObj.position.copy(worldPosition);
          blocksToAdd.push(blockObj);
        }
        
        scene.remove(blockGroup);
        
        // 批量添加方块到场景
        for (let i = 0; i < blocksToAdd.length; i++) {
          scene.add(blocksToAdd[i]);
        }
        
        // 动画完成时进行一次最终渲染
        renderer.render(scene, camera);
        
        // 解析 Promise，表示动画完成
        resolve();
      }
    }
    
    // 开始动画
    animationFrameId = requestAnimationFrame(animate);
    
    // 添加取消动画的方法
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });
}

// tip函数：在指定位置显示提示信息（优化版）
async function tip(x, y, z, text, color, duration) {
  // 1. 创建正方体轮廓（使用TubeGeometry创建可调整粗细的边框）
  const cubeSize = 1.05; // 略大于1，确保轮廓包围方块
  
  // 预创建正方体的顶点
  const vertices = [
    // 前面
    new THREE.Vector3(-cubeSize/2, -cubeSize/2, cubeSize/2),
    new THREE.Vector3(cubeSize/2, -cubeSize/2, cubeSize/2),
    new THREE.Vector3(cubeSize/2, cubeSize/2, cubeSize/2),
    new THREE.Vector3(-cubeSize/2, cubeSize/2, cubeSize/2),
    // 后面
    new THREE.Vector3(-cubeSize/2, -cubeSize/2, -cubeSize/2),
    new THREE.Vector3(cubeSize/2, -cubeSize/2, -cubeSize/2),
    new THREE.Vector3(cubeSize/2, cubeSize/2, -cubeSize/2),
    new THREE.Vector3(-cubeSize/2, cubeSize/2, -cubeSize/2)
  ];
  
  // 创建边框线条组
  const cubeOutline = new THREE.Group();
  const tubeRadius = 0.03; // 调整这个值来改变边框粗细
  const radialSegments = 6; // 圆形截面的分段数，值越大越圆
  
  // 存储所有边框部件，用于动画
  const edges = [];
  
  // 预定义材质选项
  const materialOptions = { 
    color: color || 'red',
    transparent: true,
    opacity: 0.9
  };
  
  // 创建底面四条边（固定不动）
  const bottomEdges = [
    [vertices[4], vertices[5]], // 后面底边
    [vertices[5], vertices[1]], // 右面底边
    [vertices[1], vertices[0]], // 前面底边
    [vertices[0], vertices[4]]  // 左面底边
  ];
  
  for (let i = 0; i < bottomEdges.length; i++) {
    const edge = bottomEdges[i];
    const curve = new THREE.LineCurve3(edge[0], edge[1]);
    const tubeGeometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    const tubeMaterial = new THREE.MeshBasicMaterial(materialOptions);
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    cubeOutline.add(tubeMesh);
    edges.push(tubeMesh);
  }
  
  // 创建顶面四条边（初始位置在底面）
  const topEdges = [
    [vertices[6], vertices[7]], // 后面顶边
    [vertices[7], vertices[3]], // 左面顶边
    [vertices[3], vertices[2]], // 前面顶边
    [vertices[2], vertices[6]]  // 右面顶边
  ];
  
  const topEdgeMeshes = [];
  for (let i = 0; i < topEdges.length; i++) {
    const edge = topEdges[i];
    // 初始位置在底面
    const startPoint = new THREE.Vector3(edge[0].x, -cubeSize/2, edge[0].z);
    const endPoint = new THREE.Vector3(edge[1].x, -cubeSize/2, edge[1].z);
    const curve = new THREE.LineCurve3(startPoint, endPoint);
    const tubeGeometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    const tubeMaterial = new THREE.MeshBasicMaterial(materialOptions);
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    cubeOutline.add(tubeMesh);
    edges.push(tubeMesh);
    topEdgeMeshes.push({
      mesh: tubeMesh,
      startPos: startPoint,
      endPos: endPoint,
      targetStartPos: edge[0],
      targetEndPos: edge[1]
    });
  }
  
  // 创建四条高（棱）（初始高度为0）
  const verticalEdges = [
    { start: vertices[4], end: vertices[6] }, // 后面左棱
    { start: vertices[5], end: vertices[2] }, // 右面后棱
    { start: vertices[1], end: vertices[3] }, // 前面右棱
    { start: vertices[0], end: vertices[7] }  // 左面前棱
  ];
  
  const verticalEdgeMeshes = [];
  for (let i = 0; i < verticalEdges.length; i++) {
    const edge = verticalEdges[i];
    // 初始高度为0，即起点和终点相同
    const startPoint = edge.start.clone();
    const endPoint = edge.start.clone(); // 初始时终点与起点相同
    const curve = new THREE.LineCurve3(startPoint, endPoint);
    const tubeGeometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({ 
      color: color || 'red',
      transparent: true,
      opacity: 0.8
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    cubeOutline.add(tubeMesh);
    edges.push(tubeMesh);
    verticalEdgeMeshes.push({
      mesh: tubeMesh,
      startPos: startPoint,
      endPos: endPoint,
      targetEndPos: edge.end
    });
  }
  
  cubeOutline.position.set(x, y, z);
  scene.add(cubeOutline);
  
  // 2. 创建2D HTML内容
  const tipElement = document.createElement('div');
  tipElement.className = 'ponder-tip-progress';
  tipElement.innerHTML = text;
  tipElement.style.opacity = '0'; // 初始透明
  
  // 创建进度条容器
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'ponder-tip-progress-container';
  
  // 创建进度条
  const progressBar = document.createElement('div');
  progressBar.className = 'ponder-tip-progress-bar';
  progressBar.style.width = '0%'; // 初始宽度为0
  
  // 将进度条添加到容器
  progressBarContainer.appendChild(progressBar);
  tipElement.appendChild(progressBarContainer);
  
  document.body.appendChild(tipElement);
  
  // 3. 创建一个虚拟的3D对象来获取方块在屏幕上的位置
  const blockPosition = new THREE.Vector3(x, y + 0.7, z); // 稍微上移，避免与方块重叠
  
  // 4. 更新文本框位置的函数
  let animationFrameId;
  let resizeListener;
  
  function updateTipPosition() {
    // 将3D坐标投影到2D屏幕坐标
    const vector = blockPosition.clone().project(camera);
    
    // 转换为屏幕坐标
    const xPercent = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const yPercent = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    
    // 设置文本框位置，向右偏移20像素
    tipElement.style.left = (xPercent + 20) + 'px';
    tipElement.style.top = yPercent + 'px';
    
    // 检查方块是否在相机视野内
    const inView = vector.z < 1;
    tipElement.style.display = inView ? 'block' : 'none';
  }
  
  // 初始更新位置
  updateTipPosition();
  
  // 添加窗口大小变化监听器
  resizeListener = () => updateTipPosition();
  window.addEventListener('resize', resizeListener);
  
  // 添加渲染循环监听器，持续更新位置
  function animate() {
    updateTipPosition();
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
  
  // 5. 边框动画效果
  const animationDuration = 0.5; // 动画持续时间（秒）
  const startTime = Date.now();
  let outlineAnimationFrameId;
    
  function updateOutlineAnimation() {
    const elapsed = (Date.now() - startTime) / 1000; // 转换为秒
    const rawProgress = Math.min(elapsed / animationDuration, 1); // 0到1的原始进度
    const progress = easeInOut(rawProgress); // 应用缓动函数
    
    // 更新顶面位置
    for (let i = 0; i < topEdgeMeshes.length; i++) {
      const edgeObj = topEdgeMeshes[i];
      // 计算当前顶面位置（从底面上升到顶面）
      const currentY = -cubeSize/2 + (cubeSize * progress);
      
      const currentStartPos = new THREE.Vector3(
        edgeObj.targetStartPos.x,
        currentY,
        edgeObj.targetStartPos.z
      );
      
      const currentEndPos = new THREE.Vector3(
        edgeObj.targetEndPos.x,
        currentY,
        edgeObj.targetEndPos.z
      );
      
      // 更新几何体
      const curve = new THREE.LineCurve3(currentStartPos, currentEndPos);
      edgeObj.mesh.geometry.dispose(); // 释放旧几何体
      edgeObj.mesh.geometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    }
    
    // 更新四条棱的高度
    for (let i = 0; i < verticalEdgeMeshes.length; i++) {
      const edgeObj = verticalEdgeMeshes[i];
      // 计算当前棱的终点位置（从底面上升到顶面）
      const currentEndY = edgeObj.startPos.y + (cubeSize * progress);
      
      const currentEndPos = new THREE.Vector3(
        edgeObj.startPos.x,
        currentEndY,
        edgeObj.startPos.z
      );
      
      // 更新几何体
      const curve = new THREE.LineCurve3(edgeObj.startPos, currentEndPos);
      edgeObj.mesh.geometry.dispose(); // 释放旧几何体
      edgeObj.mesh.geometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    }
    
    // 如果动画未完成，继续更新
    if (rawProgress < 1) {
      outlineAnimationFrameId = requestAnimationFrame(updateOutlineAnimation);
    }
  }
  
  // 开始边框动画
  outlineAnimationFrameId = requestAnimationFrame(updateOutlineAnimation);
  
  // 6. 文本动画效果
  // 等待边框动画完成后，使HTML内容浮现
  await idle(animationDuration);
  tipElement.style.opacity = '1';
  
  // 立即启动进度条动画
  progressBar.style.transition = `width ${duration}s linear`;
  requestAnimationFrame(() => {
    progressBar.style.width = '100%'; // 进度条从0%过渡到100%
  });
  
  // 等待指定秒数
  await idle(duration);
  
  // 在0.5秒内将HTML内容的透明度平滑过渡至0
  tipElement.style.opacity = '0';
  
  // 等待0.5秒让淡出动画完成
  await idle(0.5);
  
  // 7. 为线条添加透明度渐变效果
  const fadeOutDuration = 1.0; // 1秒的渐变效果
  const originalOpacities = [];
  for (let i = 0; i < edges.length; i++) {
    originalOpacities.push(edges[i].material.opacity);
  }
  
  let fadeAnimationFrameId;
  const fadeStartTime = Date.now();
  
  function updateEdgeOpacity() {
    const elapsed = (Date.now() - fadeStartTime) / 1000;
    const progress = Math.min(elapsed / fadeOutDuration, 1);
    
    // 更新所有线条的透明度
    for (let i = 0; i < edges.length; i++) {
      edges[i].material.opacity = originalOpacities[i] * (1 - progress);
    }
    
    // 如果渐变未完成，继续更新
    if (progress < 1) {
      fadeAnimationFrameId = requestAnimationFrame(updateEdgeOpacity);
    } else {
      // 渐变完成后，清理资源
      cleanupResources();
    }
  }
  
  // 开始透明度渐变
  fadeAnimationFrameId = requestAnimationFrame(updateEdgeOpacity);
  
  // 8. 清理资源
  function cleanupResources() {
    // 移除元素
    scene.remove(cubeOutline);
    document.body.removeChild(tipElement);
    
    // 释放几何体内存
    for (let i = 0; i < edges.length; i++) {
      edges[i].geometry.dispose();
      edges[i].material.dispose();
    }
    
    // 移除事件监听器和动画循环
    window.removeEventListener('resize', resizeListener);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (outlineAnimationFrameId) cancelAnimationFrame(outlineAnimationFrameId);
    if (fadeAnimationFrameId) cancelAnimationFrame(fadeAnimationFrameId);
    
    // 强制最终渲染更新
    renderer.render(scene, camera);
  }
}

// tiparea函数：在指定区域内显示提示信息
async function tiparea(x1, y1, z1, x2, y2, z2, text, color, duration) {
  // 确保坐标范围正确（从小到大）
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  
  // 计算区域中心点
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;
  
  // 1. 创建区域轮廓
  const tubeRadius = 0.03;
  const radialSegments = 6;
  const areaOutline = new THREE.Group();
  const edges = [];
  
  // 创建边框线条的通用函数
  function createEdge(start, end, opacity = 0.8) {
    const curve = new THREE.LineCurve3(start, end);
    const tubeGeometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({ 
      color: color || 'red',
      transparent: true,
      opacity
    });
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    areaOutline.add(tubeMesh);
    edges.push(tubeMesh);
    return tubeMesh;
  }
  
  // 创建区域的12条边
  const bottomY = minY - 0.5;
  const topY = maxY + 0.5;
  
  // 底面四条边（固定不动）
  createEdge(new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5), new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5), 0.9);
  createEdge(new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5), new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5), 0.9);
  createEdge(new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5), new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5), 0.9);
  createEdge(new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5), new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5), 0.9);
  
  // 顶面四条边（初始位置在底面）
  const topEdgeMeshes = [
    {
      mesh: createEdge(new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5), new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5), 0.9),
      targetStartPos: new THREE.Vector3(minX - 0.5, topY, minZ - 0.5),
      targetEndPos: new THREE.Vector3(maxX + 0.5, topY, minZ - 0.5)
    },
    {
      mesh: createEdge(new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5), new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5), 0.9),
      targetStartPos: new THREE.Vector3(maxX + 0.5, topY, minZ - 0.5),
      targetEndPos: new THREE.Vector3(maxX + 0.5, topY, maxZ + 0.5)
    },
    {
      mesh: createEdge(new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5), new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5), 0.9),
      targetStartPos: new THREE.Vector3(maxX + 0.5, topY, maxZ + 0.5),
      targetEndPos: new THREE.Vector3(minX - 0.5, topY, maxZ + 0.5)
    },
    {
      mesh: createEdge(new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5), new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5), 0.9),
      targetStartPos: new THREE.Vector3(minX - 0.5, topY, maxZ + 0.5),
      targetEndPos: new THREE.Vector3(minX - 0.5, topY, minZ - 0.5)
    }
  ];
  
  // 四条垂直边（初始高度为0）
  const verticalEdgeMeshes = [
    {
      mesh: createEdge(new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5), new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5)),
      startPos: new THREE.Vector3(minX - 0.5, bottomY, minZ - 0.5),
      targetEndPos: new THREE.Vector3(minX - 0.5, topY, minZ - 0.5)
    },
    {
      mesh: createEdge(new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5), new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5)),
      startPos: new THREE.Vector3(maxX + 0.5, bottomY, minZ - 0.5),
      targetEndPos: new THREE.Vector3(maxX + 0.5, topY, minZ - 0.5)
    },
    {
      mesh: createEdge(new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5), new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5)),
      startPos: new THREE.Vector3(maxX + 0.5, bottomY, maxZ + 0.5),
      targetEndPos: new THREE.Vector3(maxX + 0.5, topY, maxZ + 0.5)
    },
    {
      mesh: createEdge(new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5), new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5)),
      startPos: new THREE.Vector3(minX - 0.5, bottomY, maxZ + 0.5),
      targetEndPos: new THREE.Vector3(minX - 0.5, topY, maxZ + 0.5)
    }
  ];
  
  scene.add(areaOutline);
  
  // 2. 创建2D HTML内容
  const tipElement = document.createElement('div');
  tipElement.className = 'ponder-tip-progress';
  tipElement.innerHTML = text;
  tipElement.style.opacity = '0'; // 初始透明
  
  // 创建进度条
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'ponder-tip-progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'ponder-tip-progress-bar';
  progressBar.style.width = '0%'; // 初始宽度为0
  progressBarContainer.appendChild(progressBar);
  tipElement.appendChild(progressBarContainer);
  
  document.body.appendChild(tipElement);
  
  // 3. 更新文本框位置的函数
  const areaPosition = new THREE.Vector3(centerX, centerY + (maxY - minY + 1)/2 + 0.7, centerZ);
  
  let animationFrameId;
  let resizeListener;
  
  function updateTipPosition() {
    const vector = areaPosition.clone().project(camera);
    const xPercent = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const yPercent = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    
    tipElement.style.left = (xPercent + 20) + 'px';
    tipElement.style.top = yPercent + 'px';
    tipElement.style.display = vector.z < 1 ? 'block' : 'none';
  }
  
  // 初始更新位置
  updateTipPosition();
  
  // 添加事件监听器
  resizeListener = () => updateTipPosition();
  window.addEventListener('resize', resizeListener);
  
  // 添加渲染循环监听器，持续更新位置
  function animate() {
    updateTipPosition();
    animationFrameId = requestAnimationFrame(animate);
  }
  animationFrameId = requestAnimationFrame(animate);
  
  // 4. 边框动画效果
  const animationDuration = 0.5;
  const startTime = Date.now();
  const heightDiff = topY - bottomY;
  let outlineAnimationFrameId;
    
  function updateOutlineAnimation() {
    const elapsed = (Date.now() - startTime) / 1000;
    const rawProgress = Math.min(elapsed / animationDuration, 1);
    const progress = easeInOut(rawProgress);
    
    // 更新顶面位置
    for (let i = 0; i < topEdgeMeshes.length; i++) {
      const edgeObj = topEdgeMeshes[i];
      const currentY = bottomY + (heightDiff * progress);
      const currentStartPos = new THREE.Vector3(edgeObj.targetStartPos.x, currentY, edgeObj.targetStartPos.z);
      const currentEndPos = new THREE.Vector3(edgeObj.targetEndPos.x, currentY, edgeObj.targetEndPos.z);
      
      const curve = new THREE.LineCurve3(currentStartPos, currentEndPos);
      edgeObj.mesh.geometry.dispose();
      edgeObj.mesh.geometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    }
    
    // 更新垂直边高度
    for (let i = 0; i < verticalEdgeMeshes.length; i++) {
      const edgeObj = verticalEdgeMeshes[i];
      const currentEndY = edgeObj.startPos.y + (heightDiff * progress);
      const currentEndPos = new THREE.Vector3(edgeObj.startPos.x, currentEndY, edgeObj.startPos.z);
      
      const curve = new THREE.LineCurve3(edgeObj.startPos, currentEndPos);
      edgeObj.mesh.geometry.dispose();
      edgeObj.mesh.geometry = new THREE.TubeGeometry(curve, 1, tubeRadius, radialSegments, false);
    }
    
    if (rawProgress < 1) {
      outlineAnimationFrameId = requestAnimationFrame(updateOutlineAnimation);
    }
  }
  
  // 开始边框动画
  outlineAnimationFrameId = requestAnimationFrame(updateOutlineAnimation);
  
  // 5. 文本动画效果
  await idle(animationDuration);
  tipElement.style.opacity = '1';
  
  progressBar.style.transition = `width ${duration}s linear`;
  requestAnimationFrame(() => {
    progressBar.style.width = '100%';
  });
  
  await idle(duration);
  
  tipElement.style.opacity = '0';
  await idle(0.5);
  
  // 6. 为线条添加透明度渐变效果
  const fadeOutDuration = 1.0; // 1秒的渐变效果
  const originalOpacities = [];
  for (let i = 0; i < edges.length; i++) {
    originalOpacities.push(edges[i].material.opacity);
  }
  
  let fadeAnimationFrameId;
  const fadeStartTime = Date.now();
  
  function updateEdgeOpacity() {
    const elapsed = (Date.now() - fadeStartTime) / 1000;
    const progress = Math.min(elapsed / fadeOutDuration, 1);
    
    // 更新所有线条的透明度
    for (let i = 0; i < edges.length; i++) {
      edges[i].material.opacity = originalOpacities[i] * (1 - progress);
    }
    
    // 如果渐变未完成，继续更新
    if (progress < 1) {
      fadeAnimationFrameId = requestAnimationFrame(updateEdgeOpacity);
    } else {
      // 渐变完成后，清理资源
      cleanupResources();
    }
  }
  
  // 开始透明度渐变
  fadeAnimationFrameId = requestAnimationFrame(updateEdgeOpacity);
  
  // 7. 清理资源
  function cleanupResources() {
    scene.remove(areaOutline);
    document.body.removeChild(tipElement);
    
    for (let i = 0; i < edges.length; i++) {
      edges[i].geometry.dispose();
      edges[i].material.dispose();
    }
    
    window.removeEventListener('resize', resizeListener);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (outlineAnimationFrameId) cancelAnimationFrame(outlineAnimationFrameId);
    if (fadeAnimationFrameId) cancelAnimationFrame(fadeAnimationFrameId);
    
    renderer.render(scene, camera);
  }
}

// 摄像机平滑移动函数
function moveCamera(isAsync, x, y, z, duration) {
  // 获取当前摄像机位置
  const startPos = camera.position.clone();
  const targetPos = new THREE.Vector3(x, y, z);
  
  let startTime = null;
  let animationFrameId;
  
  // 创建 Promise，仅在 isAsync 为 false 时返回
  const promise = new Promise(resolve => {
    function animateCamera(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // 转换为秒
      const progress = Math.min(elapsed / duration, 1); // 0到1的进度
      const easedProgress = easeInOut(progress); // 应用缓动函数
      
      // 使用线性插值计算当前位置
      const currentPos = new THREE.Vector3().lerpVectors(startPos, targetPos, easedProgress);
      camera.position.copy(currentPos);
      
      // 确保摄像机始终朝向原点 (0,0,0)
      camera.lookAt(0, 0, 0);
      
      // 渲染场景
      renderer.render(scene, camera);
      
      // 如果动画未完成，继续更新
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCamera);
      } else if (!isAsync) {
        // 动画完成且需要等待时，解析 Promise
        resolve();
      }
    }
    
    // 开始摄像机动画
    animationFrameId = requestAnimationFrame(animateCamera);
  });
  
  // 根据 isAsync 参数决定是否返回 Promise
  return isAsync ? undefined : promise;
}

// 移除方块
function removeblock(x, y, z) {
  // 查找位于指定坐标的方块
  let blockToRemove = null;
  for (let i = 0; i < scene.children.length; i++) {
    const child = scene.children[i];
    if (child.position.x === x && 
        child.position.y === y && 
        child.position.z === z && 
        child.type === 'Mesh') {
      blockToRemove = child;
      break;
    }
  }
  
  if (blockToRemove) {
    // 从场景中移除方块
    scene.remove(blockToRemove);
    
    // 释放几何体和材质的内存
    if (blockToRemove.geometry) {
      blockToRemove.geometry.dispose();
    }
    if (blockToRemove.material) {
      if (Array.isArray(blockToRemove.material)) {
        for (let i = 0; i < blockToRemove.material.length; i++) {
          blockToRemove.material[i].dispose();
        }
      } else {
        blockToRemove.material.dispose();
      }
    }
    
    // 强制渲染更新
    renderer.render(scene, camera);
  }
  // 如果没有找到方块，不显示任何信息
}
function removeblockup(x, y, z, duration) {
  // 查找位于指定坐标的方块
  let blockToRemove = null;
  for (let i = 0; i < scene.children.length; i++) {
    const child = scene.children[i];
    if (child.position.x === x && 
        child.position.y === y && 
        child.position.z === z && 
        child.type === 'Mesh') {
      blockToRemove = child;
      break;
    }
  }
  
  if (blockToRemove) {
    // 返回一个 Promise，以便支持 await 等待
    return new Promise(resolve => {
      // 同时执行移动和渐变动画
      Promise.all([
        moveBlock(x, y, z, x, y + 1, z, duration),
        fadeBlock(x, y, z, 1, 0, duration)
      ]).then(() => {
        // 动画完成后，从场景中移除方块
        scene.remove(blockToRemove);
        
        // 释放几何体和材质的内存
        if (blockToRemove.geometry) {
          blockToRemove.geometry.dispose();
        }
        if (blockToRemove.material) {
          if (Array.isArray(blockToRemove.material)) {
            for (let i = 0; i < blockToRemove.material.length; i++) {
              blockToRemove.material[i].dispose();
            }
          } else {
            blockToRemove.material.dispose();
          }
        }
        
        // 强制最终渲染更新
        renderer.render(scene, camera);
        
        // 解析 Promise，表示动画完成
        resolve();
      });
    });
  } else {
    // 如果没有找到方块，返回一个已解析的 Promise，不显示任何信息
    return Promise.resolve();
  }
}
function removearea(x1, y1, z1, x2, y2, z2) {
  // 确保坐标范围正确（从小到大）
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  
  // 遍历区域内的每个坐标，并调用 removeblock 函数
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        removeblock(x, y, z);
      }
    }
  }
  
  // 在区域移除完成后进行一次渲染
  renderer.render(scene, camera);
}
function removeareaup(x1, y1, z1, x2, y2, z2, duration) {
  // 确保坐标范围正确（从小到大）
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  
  // 创建一个组来包含所有方块
  const blockGroup = new THREE.Group();
  
  // 计算区域的中心点，用于组的位置
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;
  
  // 查找区域内的所有方块，并将它们添加到组中
  const blocksToRemove = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        // 查找位于指定坐标的方块
        let blockToRemove = null;
        for (let i = 0; i < scene.children.length; i++) {
          const child = scene.children[i];
          if (child.position.x === x && 
              child.position.y === y && 
              child.position.z === z && 
              child.type === 'Mesh') {
            blockToRemove = child;
            break;
          }
        }
        
        if (blockToRemove) {
          // 从场景中移除方块
          scene.remove(blockToRemove);
          
          // 相对于组的位置设置方块位置
          blockToRemove.position.set(x - centerX, y - centerY, z - centerZ);
          
          // 确保材质支持透明度
          if (!blockToRemove.material.transparent) {
            blockToRemove.material.transparent = true;
          }
          
          // 将方块添加到组中
          blockGroup.add(blockToRemove);
          blocksToRemove.push(blockToRemove);
        }
      }
    }
  }
  
  // 如果没有找到任何方块，返回一个已解析的 Promise
  if (blocksToRemove.length === 0) {
    return Promise.resolve();
  }
  
  // 设置组的位置
  blockGroup.position.set(centerX, centerY, centerZ);
  
  // 将组添加到场景中
  scene.add(blockGroup);
  
  // 强制渲染一次，确保组已添加到场景中
  renderer.render(scene, camera);
  
  // 返回一个 Promise，用于执行组的动画
  return new Promise(resolve => {
    let startTime = null;
    let animationFrameId;
    
    // 目标位置
    const targetY = centerY + 1; // 向上移动一个单位
    
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // 应用缓动函数
      const easedProgress = easeInOut(progress);
      
      // 更新组的位置
      blockGroup.position.y = centerY + (targetY - centerY) * easedProgress;
      
      // 更新组内所有方块的透明度
      const opacity = 1 - easedProgress;
      for (let i = 0; i < blockGroup.children.length; i++) {
        const blockObj = blockGroup.children[i];
        if (blockObj.material) {
          blockObj.material.opacity = opacity;
        }
      }
      
      // 渲染场景
      renderer.render(scene, camera);
      
      // 如果动画未完成，继续更新
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // 动画完成，释放所有方块的资源
        for (let i = 0; i < blockGroup.children.length; i++) {
          const blockObj = blockGroup.children[i];
          // 释放几何体和材质的内存
          if (blockObj.geometry) {
            blockObj.geometry.dispose();
          }
          if (blockObj.material) {
            if (Array.isArray(blockObj.material)) {
              for (let j = 0; j < blockObj.material.length; j++) {
                blockObj.material[j].dispose();
              }
            } else {
              blockObj.material.dispose();
            }
          }
        }
        
        // 从场景中移除组
        scene.remove(blockGroup);
        
        // 强制最终渲染更新
        renderer.render(scene, camera);
        
        // 解析 Promise，表示动画完成
        resolve();
      }
    }
    
    // 开始动画
    animationFrameId = requestAnimationFrame(animate);
  });
}

// 重置场景函数，自动发现区域大小并清除所有方块
function cleanscene(isAsync) {
  // 初始化最大和最小坐标
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  
  // 遍历场景中的所有对象，找到所有方块的最大和最小坐标
  for (let i = 0; i < scene.children.length; i++) {
    const child = scene.children[i];
    if (child.type === 'Mesh') {
      // 更新最小坐标
      minX = Math.min(minX, child.position.x);
      minY = Math.min(minY, child.position.y);
      minZ = Math.min(minZ, child.position.z);
      
      // 更新最大坐标
      maxX = Math.max(maxX, child.position.x);
      maxY = Math.max(maxY, child.position.y);
      maxZ = Math.max(maxZ, child.position.z);
    }
  }
  
  // 如果场景中没有方块，直接返回
  if (minX === Infinity || maxX === -Infinity) {
    return isAsync ? undefined : Promise.resolve();
  }
  
  // 调用 removeareaup 函数删除发现的区域内的所有方块
  const result = removeareaup(minX, minY, minZ, maxX, maxY, maxZ, 1);
  
  // 根据 isAsync 参数决定是否返回 Promise
  return isAsync ? undefined : result;
}



// 计算 ponderFragment(x) 函数中所有函数将会使用的时间
function calculatePonderFragmentTime(fragmentNum) {
  // 通过fragmentNum获取对应的函数
  const fragmentFunction = window['ponderFragment'+fragmentNum];
  if(!fragmentFunction){
    console.error(`未找到ponderFragment${fragmentNum}函数`);
    return 0;
  }
  // 将函数转换为字符串
  const functionString = fragmentFunction.toString();
  
  // 提取函数体
  const functionBody = functionString.match(/{([\s\S]*)}/)[1];
  
  // 按行分割函数体
  const lines = functionBody.split('\n');
  
  let totalTime = 0;
  
  // 定义每个函数的执行时间（秒）
  const functionTimes = {
    'idle': (params) => {
      // idle(duration) - 执行时间为指定的秒数
      const duration = parseFloat(params[0]);
      return isNaN(duration) ? 0 : duration;
    },
    'setblock': () => 0, // 立即执行，时间为 0
    'setblockfall': (params) => {
      // setblockfall(block, x, y, z, duration) - 执行时间为 duration 秒
      // 注意：多个setblockfall通常是并行执行的，所以只计算一次
      const duration = parseFloat(params[4]);
      return isNaN(duration) ? 0 : duration;
    },
    'fill': () => 0, // 立即执行，时间为 0
    'fillfall': (params) => {
      // fillfall(block, x1, y1, z1, x2, y2, z2, duration) - 执行时间为 duration 秒
      // 虽然fillfall函数内部调用多个setblockfall，但它们是并行执行的，所以只计算一次duration
      const duration = parseFloat(params[7]);
      return isNaN(duration) ? 0 : duration;
    },
    'tip': (params) => {
      // tip(x, y, z, text, color, duration) - 执行时间为 duration + 1 秒
      // 包括：边框动画(0.5秒) + 文本显示(duration) + 文本淡出(0.5秒)
      const duration = parseFloat(params[5]);
      return (isNaN(duration) ? 0 : duration) + 1;
    },
    'tiparea': (params) => {
      // tiparea(x1, y1, z1, x2, y2, z2, text, color, duration) - 执行时间为 duration + 1 秒
      // 包括：边框动画(0.5秒) + 文本显示(duration) + 文本淡出(0.5秒)
      const duration = parseFloat(params[8]);
      return (isNaN(duration) ? 0 : duration) + 1;
    },
    'moveCamera': (params) => {
      // moveCamera(isAsync, x, y, z, duration) - 执行时间为 duration 秒
      // 只有当第一个参数为 'false' 或 false 时，才需要等待并计算时间
      const duration = parseFloat(params[4]);
      const needsWait = params[0] === 'false' || params[0] === false;
      return needsWait ? (isNaN(duration) ? 0 : duration) : 0;
    },
    'removeblockup': (params) => {
      // removeblockup(x, y, z, duration) - 执行时间为 duration 秒
      const duration = parseFloat(params[3]);
      return isNaN(duration) ? 0 : duration;
    },
    'removeareaup': (params) => {
      // removeareaup(x1, y1, z1, x2, y2, z2, duration) - 执行时间为 duration 秒
      const duration = parseFloat(params[6]);
      return isNaN(duration) ? 0 : duration;
    },
    'cleanscene': (params) => {
      // cleanscene(isAsync) - 特殊处理，内部调用 removeareaup
      // 特殊处理：检查是否有默认 duration 参数
      const hasDuration = params.length > 1 && !isNaN(parseFloat(params[1]));
      const duration = hasDuration ? parseFloat(params[1]) : 1; // 默认 1 秒
      return duration;
    },
    'CreateBase': () => 0, // 立即执行，时间为 0
    'removeblock': () => 0, // 立即执行，时间为 0
    'removearea': () => 0, // 立即执行，时间为 0
    'moveBlock': (params) => {
      // moveBlock(startX, startY, startZ, targetX, targetY, targetZ, duration) - 执行时间为 duration 秒
      const duration = parseFloat(params[6]);
      return isNaN(duration) ? 0 : duration;
    },
    'fadeBlock': (params) => {
      // fadeBlock(x, y, z, startOpacity, endOpacity, duration) - 执行时间为 duration 秒
      const duration = parseFloat(params[5]);
      return isNaN(duration) ? 0 : duration;
    }
  };
  
  // 遍历每一行
  for (const line of lines) {
    // 去除行首尾的空白字符
    const trimmedLine = line.trim();
    
    // 跳过空行和注释
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
      continue;
    }
    
    // 检查是否包含函数调用
    for (const [funcName, timeCalculator] of Object.entries(functionTimes)) {
      // 创建正则表达式来匹配函数调用
      const regex = new RegExp(`${funcName}\\s*\\(([^)]*)\\)`);
      const match = trimmedLine.match(regex);
      
      if (match) {
        // 提取参数
        const params = match[1].split(',').map(param => param.trim());
        
        // 根据ffawait数组判断是否需要await
        let needsAwait = false;
        
        // 检查是否匹配ffawait数组中的任何模式
        for (const awaitPattern of ffawait) {
          // 使用正则表达式检查是否匹配
          const regex = new RegExp(`\\b${awaitPattern.replace('(', '\\s*\\(')}`);
          if (regex.test(trimmedLine)) {
            needsAwait = true;
            break;
          }
        }
        
        // 计算函数执行时间
        const time = timeCalculator(params);
        
        // 只有需要await的函数才累加时间
        if (needsAwait) {
          totalTime += time;
        }
        
        break; // 跳出循环，避免重复计算
      }
    }
  }
  
  return totalTime;
}
