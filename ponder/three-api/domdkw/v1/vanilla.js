let MCTextureMap;
(async()=>{
  const index = window.Process.indexes;
  if(!index) return;
  MCTextureMap = await loadFile('/ponder/'+index, 'json', true, `<span class="file-tag mr y">vanilla.js</span>=><span class="file-tag mr ml y">${index}</span>加载贴图映射文件`)
})();
function fallAnimation(obj, startY) {//方块下落动画
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
