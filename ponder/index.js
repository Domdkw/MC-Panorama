//2025.8.12 从/index.html抽离
//此脚本用于构建HTML、拉取JS文件和处理物品数据

//添加表格
const CreatePage = document.createElement('section');
CreatePage.id = 'create-page';
CreatePage.classList.add('dirt', 'abso');
CreatePage.innerHTML = `
<div id="outer-container">
  <div class="chest-title">
    <span>思索索引</span>
  </div>
  <table id="chest-grid">
    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
  </table>
</div>
`;
body.appendChild(CreatePage);

//初始化
let ponderApi;
let processURL;
// 获取物品JSON数据
const ItemJson = fetch('./ponder/item.json');
terminal.innerHTML = '加载物品列表数据(/ponder/item.json)';
ItemJson.then(res => res.json()).then(json => {
  // 等待页面元素创建完成后处理数据
  setTimeout(() => {
    addItemsToGrid(json);
  }, 100);
}).catch(e => {console.error(e);terminal.innerHTML = e;});

// 将物品添加到表格网格并实现分页功能8.15
function addItemsToGrid(items) {
  const table = document.getElementById('chest-grid');
  if (!table) return;
  terminal.innerHTML = '';
  // 配置
  const itemsPerPage = 45; // 5行 × 9列
  let currentPage = 0;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // 获取所有单元格，跳过最后一行
  const contentRows = table.querySelectorAll('tr:not(:last-child)');
  // 获取最后一行（分页控制行）
  const paginationRow = table.querySelector('tr:last-child');
  const paginationCells = paginationRow.querySelectorAll('td');

  // 渲染指定页的物品
  function renderPage(pageIndex) {
    // 清空所有内容单元格
    contentRows.forEach(row => {
      row.querySelectorAll('td').forEach(cell => {
        cell.innerHTML = '';
      });
    });

    // 计算当前页的物品范围
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const pageItems = items.slice(startIndex, endIndex);

    // 渲染物品到表格
    pageItems.forEach((item, index) => {
      const globalIndex = startIndex + index;
      const rowIndex = Math.floor(globalIndex / 9);
      const colIndex = globalIndex % 9;

      if (rowIndex < contentRows.length) {// 检查行索引是否有效
        const cell = contentRows[rowIndex].querySelectorAll('td')[colIndex];
        if (!cell) return;// 检查单元格是否存在
        const img = document.createElement('img');// 创建图片元素
        terminal.innerHTML += '-加载物品图标(' + item.icon + ')<br>';
        img.src = item.icon;
        img.alt = item.name;
        img.setAttribute('data-itemindex', globalIndex);
        cell.innerHTML = '';
        cell.appendChild(img);
        // 只给包含图片的单元格添加点击事件监听器
        cell.addEventListener('click', function() {
          const imgElement = this.querySelector('img');
          if (!imgElement) return;// 确保单元格包含图片
          const itemIndex = imgElement.getAttribute('data-itemindex');// 获取itemindex属性
          if (itemIndex === null) return;// 检查是否拥有索引
          // 从JSON数据中获取对应的API地址和Process信息
          const selectedItem = items[parseInt(itemIndex)];
          if (!selectedItem) return;
          processURL = selectedItem.process;
          ponderApiLoad().catch(error => {console.error('Failed to load ponder API:', error);});
        });
      }
    });
    updatePaginationButtons();// 更新分页按钮状态
  }

  // 更新分页按钮状态
  function updatePaginationButtons() {
    // 清空分页行所有单元格
    paginationCells.forEach(cell => { cell.innerHTML = ''; });

    // 只有当物品数量超过一页时才显示分页按钮
    if (totalPages > 1) {
      // 左翻页按钮（第一个单元格）
      if (currentPage > 0) {
        const leftImg = document.createElement('img');
        leftImg.src = '/ponder/minecraft/item/spectral_arrow.webp';
        leftImg.alt = '上一页';
        leftImg.style.transform = 'rotate(-135deg)'; // 旋转-135度
        leftImg.style.cursor = 'pointer';
        leftImg.addEventListener('click', () => {
          currentPage--;
          renderPage(currentPage);
        });
        paginationCells[0].appendChild(leftImg);
      }
      // 右翻页按钮（最后一个单元格）
      if (currentPage < totalPages - 1) {
        const rightImg = document.createElement('img');
        rightImg.src = '/ponder/minecraft/item/spectral_arrow.webp';
        rightImg.alt = '下一页';
        rightImg.style.transform = 'rotate(45deg)'; // 旋转+45度
        rightImg.style.cursor = 'pointer';
        rightImg.addEventListener('click', () => {
          currentPage++;
          renderPage(currentPage);
        });
        paginationCells[8].appendChild(rightImg);
      }
    }
  }
  // 初始化第一页
  renderPage(currentPage);
}

//拉取文件显示函数->调用SNLB（简单封装一下）
function sf (n){
  const {loadinfo} = SNLB('ponderFile-'+n, false);
  loadinfo.textContent = '加载思索程序文件-'+n;
}

async function ponderApiLoad() {
  //先清除前面的打印
  while(loadingDiv.children.length > 1){
    loadingDiv.children[1].remove();
  }
  //渐显加载界面100ms
  loadingDiv.style.display = 'flex';
  setTimeout(() => {
    loadingDiv.style.opacity = 1;
  }, 100);

  //释放界面元素
  sf('移除界面元素=>[chest-grid, options-page, app]');
  terminal.innerHTML = '';
  document.getElementById('chest-grid').remove();
  document.getElementById('options-page').remove();
  document.getElementById('app').remove();

  //加载Process文件，调用/index-loadFile函数，读取文件内容得到ponderAPI地址
  window.Process = await loadFile( processURL, 'json', true, '加载思索流程<span class="file-tag y ml">'+processURL+'</span>');
  //从Process文件中获取ponderAPI地址
  ponderApi = Process.api;
  sf('获取思索程序接口=>'+ponderApi);
  //加载PonderAPI到body
  for(let i=0; i<ponderApi.length; i++){
    loadFile('./ponder/three-api/'+ponderApi[i], 'js', true, '加载思索程序接口<span class="file-tag y ml">'+ponderApi[i]+'</span>');
  }
}

