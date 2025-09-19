let MCTextureMap;
THREE.Cache.enabled = true;

(async()=>{
  const index = window.Process.indexes;
  if(!index) return;
  MCTextureMap = await loadFile('/ponder/'+index, 'json', true, `<span class="file-tag mr y">vanilla.js</span>=><span class="file-tag mr ml y">${index}</span>加载贴图映射文件`)
  startPreload();
})();

const LoadingManager = new THREE.LoadingManager();
const TextureLoader = new THREE.TextureLoader(LoadingManager);

LoadingManager.onLoad = () => {
  console.log('所有资源加载完成');
};
LoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const {loadinfo, rangeblock} = SNLB('lm-op', true);
  loadinfo.innerHTML = `已加载${itemsLoaded}个资源，共${itemsTotal}个资源`;
  rangeblock.style.width = Math.round((itemsLoaded/itemsLoaded)*100) + '%';
};
LoadingManager.onError = (url) => {
  console.error(`加载错误: ${url}`);
};

// 预加载贴图
let loadedTexture = {};
let textureUrl = {};
function startPreload() {
  const needBlock = window.Process.loader.block;
  if(!needBlock) return;
  for (const block of needBlock) {
    if(!block in MCTextureMap) return;
    const blockName = block.split(':')[1];//取:后字段
    textureUrl[block] = '/ponder/minecraft/textures/block/'+blockName+'.png';
    console.log(textureUrl);
  }
  Object.entries(textureUrl).forEach(([block, url]) => {
    TextureLoader.load(url, (texture) => {
      loadedTexture[block] = texture;
    });
  })
}











function blockFallAnimation(obj, startY) {//方块下落动画
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
