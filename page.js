const title_main = document.getElementById("title");
let LS_accept = localStorage.getItem('LS_accept') || false;
//sti let start
let sti_moreOoops = false;
//sti let end
//自动应用LS信息25.7.31
if(LS_accept){
  const stiObj = JSON.parse( localStorage.getItem('sti') );
  stiObj.forEach(function(i){//单个键值
    switch(i.id){
      case 'sti-moreooops':sti_moreOoops = i.value;break;
    }
  });
}

//region language

const lang_support = ["en-US","zh-TW","zh-CN"];
let uselang = navLang;
let langJson;
if(lang_support.includes(navLang) && navLang !== 'zh-CN'){
  window.onload = function(){
    fetch('./lang/' + navLang + '.json')
    .then(response => response.json())
    .then(data => {
      langJson = Array.isArray(data)? data : [data];
      handleLanguageData(langJson);
    })
    .catch(error => console.error('Error fetching JSON:', error));
  }
}
function handleLanguageData(obj){
  if (Array.isArray(obj) && obj.length > 0){
    const dataObject = obj[0];
    for (const key in dataObject){
      if (dataObject.hasOwnProperty(key)){
        const lang_element = document.getElementById(key);
        if (lang_element){
          if (lang_element.tagName === 'INPUT'){
            lang_element.value = dataObject[key];
          } else{
            lang_element.textContent = dataObject[key];
          }
        }
      }
    }
  }
}

//language choose page
const lang_choose_div = document.getElementById("lang-div");
let spanId = navLang;
if(!lang_support.includes(spanId)){
  spanId = 'lang-unknown';
}
function showlang(){
  title_main.style.display = "none";
  lang_choose_div.style.display = "flex";
  let current_langspan = document.getElementById(spanId);
  current_langspan.classList.add('clicked');
  const languageList = document.querySelector('.language-list');

  languageList.addEventListener('click', function (langspan) {
    if (langspan.target.tagName === 'SPAN' && langspan.target.id !== 'lang-unknown') {
      current_langspan.classList.remove('clicked');
      spanId = langspan.target.id;
      current_langspan = document.getElementById(spanId);
      current_langspan.classList.add('clicked');
    }
  });
}
function hiddenlang(){
  title_main.style.display = "flex";
  lang_choose_div.style.display = "none";
  if(lang_support.includes(spanId) && spanId!== uselang){
    terminal.innerHTML = '请求加载语言-'+spanId;
    fetch('./lang/' + spanId + '.json')
    .then(response => response.json())
    .then(data => {
      langJson = Array.isArray(data)? data : [data];
      handleLanguageData(langJson);
      uselang = spanId;
      terminal.innerHTML = '加载语言-'+spanId+'成功';
    })
    .catch(error => {
      terminal.innerHTML = '加载语言-'+spanId+'失败';
      console.error('Can not get language profile,Error:', error);
    });
  }
  if(ttf_usestate_text){
    body.style.fontFamily = "'Minecraft-Regular', sans-serif";
  }else{
    body.style.fontFamily = "sans-serif";
  }
}
let firstfontload = false;
let ttf_usestate_text = false;
const ttf_usestate_element = document.getElementById('ttf-state');
function unicode(){
  if(!firstfontload){
    firstfontload = true;
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    styleSheet.sheet.insertRule('@font-face {font-family: "Minecraft-Regular";src: url("./assets/Minecraft-Regular.otf") format("opentype");}');
    terminal.innerHTML = '请求加载字体';
  }
  ttf_usestate_text = !ttf_usestate_text;
  if(ttf_usestate_text){
    ttf_usestate_element.textContent = 'on';
  }else{
    ttf_usestate_element.textContent = 'off'
  }
}
//endregion

//region ooops
const ooops = document.querySelector('.ooops');
// 尝试从 localStorage 获取 DlOoops 数据，若不存在则初始化
let DlOoopsStr = localStorage.getItem('DlOoops');
let DlOoops = [{'zh':false},{'en':false}];
if(DlOoopsStr){
  DlOoops = JSON.parse(DlOoopsStr);
}
if(sti_moreOoops){//不仅检查moreooops是否启用，并且检查用户是否同意使用LS
  (async ()=>{//下载对应语言的文本
    if(navLang === 'zh' || navLang === 'zh-CN'){
      if(!DlOoops[0].zh){//检查语言zh、en是否启用并下载文本集合存储在localStorage中
        let OoopsText = await loadFile('./assets/ooops/zh-CN.json','json',true,'获取zh-CN的ooops文件') || null;
        if(!OoopsText) return;
        localStorage.setItem('OoopsText', JSON.stringify(OoopsText));
        DlOoops[0].zh = true;
        localStorage.setItem('DlOoops', JSON.stringify(DlOoops));
      }
    }else{
      if(!DlOoops[1].en){
        let OoopsText = await loadFile('./assets/ooops/en-US.json','json',true,'get en-US ooops file') || null;
        if(!OoopsText) return;
        localStorage.setItem('OoopsText', OoopsText);
        DlOoops[1].en = true;
        localStorage.setItem('DlOoops', JSON.stringify(DlOoops));
      }
    }
  })();
  const ooopsInnerText = JSON.parse(localStorage.getItem('OoopsText'));
  if(ooopsInnerText){
    ooops.innerHTML = ooopsInnerText[Math.floor(Math.random() * ooopsInnerText.length)];
  }
}//再进行从文字长度更改样式
ooops.style.right = `-${ooops.offsetWidth/3}px`;
ooops.style.fontSize = `${-0.6*ooops.textContent.length +35}px`;

//region cd
const cdbg = document.getElementById('cd-page')
const cd_text_link = document.getElementById('cd_text_link')
const cd_text = document.getElementById('cd_text_info')
const cdbtn = document.getElementById('openurl')
const cdcopy = document.getElementById('urlcopy')
function cd(url, text){
  if(url){
    title_main.style.display = 'none';
    cdbg.style.display = 'block';
    cd_text_link.textContent = url;
    cd_text_link.setAttribute('href', url);
    cdbtn.setAttribute('onclick', 'window.location.href=\''+url+'\'');
    cdcopy.onclick = async function(){
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.error('无法复制文本到剪贴板: ', err);
      }
    }
    if(text){
      cd_text.textContent = text; 
    }
  }else{
    title_main.style.display = 'flex';
    cdbg.style.display = 'none';
  }
}
//endregion

//region server
const serverpage = document.getElementById('server-page');
const sv_refresh = document.getElementById('sv_refresh');
const copy_svlink = document.getElementById('copy_svlink');
const sv_list = document.querySelector('.sv-list');
const sv_list_item = document.querySelector('.sv-item');
let get_server_state = false;
let sv_item = null;
let refreshType = 'all';
function server(show){
  if(show){
    title_main.style.display = 'none';
    serverpage.style.display = 'block';
    if(!get_server_state){
      refreshsv('all');
      get_server_state = true;
    }
    sv_list.addEventListener('click', function (get_sv_item) {
      if(sv_item){
        sv_item.classList.remove('clicked');
        refreshType = 'all';
      }
      sv_item = get_sv_item.target.closest('.sv-item');
      if(sv_item){
        sv_item.classList.add('clicked');
        refreshType = sv_item.dataset.serverIp;
      }
    })
  }else{
    title_main.style.display = 'flex';
    serverpage.style.display = 'none';
  }
}
const sv_list_url = ['play.simpfun.cn:19533', 'mc.catserver.moe']
function refreshsv(){
  terminal.innerHTML = '等待服务器响应';
  if(refreshType === 'all'){
    let i = 0;
    let url = '';
    while(i < sv_list_url.length){
      if(i === sv_list_url.length - 1){
        url += sv_list_url[i]; 
      }else{
        url += sv_list_url[i] + ',';
      }
      i++;
    }
    fetch(`//minecraft-server-api-dm-7fqyy01fd0wk.deno.dev?address=${url}`)//可自建服务器，code在https://github.com/Domdkw/mcserver-api
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      terminal.innerHTML = '获取服务器状态成功';
      FSS(jsonData);
    })
    .catch(error => {
      terminal.innerHTML = '获取服务器状态失败';
      console.error('There has been a problem with your fetch operation:', error);
    });
  }else{
    fetch(`//minecraft-server-api-dm-7fqyy01fd0wk.deno.dev?address=${refreshType}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      terminal.innerHTML = '获取服务器状态成功';
      FSS(jsonData);
    })
    .catch(error => {
      terminal.innerHTML = '获取服务器状态失败';
      console.error('There has been a problem with your fetch operation:', error);
    });
  }
}
function FSS(jsonData){//refreshServer.fetchServerState刷新服务器状态
  console.log(jsonData);
  sv_list_url.forEach(serverUrl => {
    const serverElement = document.querySelector(`[data-server-ip="${serverUrl}"]`);
    if (serverElement) {
      const player_stateElement = serverElement.querySelector('.player-state');
      const sv_description = serverElement.querySelector('.sv-description');
      //const sv_item_state = serverElement.querySelector('.sv-item-state');
      if (player_stateElement) {
        let online_players = '?';
        let max_players = '?';
        if(jsonData[serverUrl].max_players){
          online_players = jsonData[serverUrl].online_players;
          max_players = jsonData[serverUrl].max_players;
          player_stateElement.innerHTML = `${online_players}<span style="color:#eee8">/</span>${max_players}`;
        }else{
          player_stateElement.innerHTML = '无法获取数据';
          player_stateElement.style.fontSize = '12px';
          player_stateElement.style.color = '#fff9';
          const img = document.createElement('img');
          img.src = './assets/page/sverror.svg';
          img.classList.add('sv-item-sp');
        }
      }
      if(sv_description){
        if(jsonData[serverUrl].description){
          sv_description.textContent = jsonData[serverUrl].description.text;
        }else if(jsonData[serverUrl].error){
          sv_description.textContent = jsonData[serverUrl].error;
          const img = document.createElement('img');
          img.src = './assets/page/sverror.svg';
          img.classList.add('sv-item-sp');
        }
      }
    }
  });
}
//endregion
//region Create
function create(){
  title_main.style.display = 'none';
  //css
  const css = document.createElement('link');
  css.href = '/ponder/chest.css';
  css.rel = 'stylesheet';
  body.appendChild(css);
  //追加脚本（无加载屏幕）
  terminal.innerHTML = '-加载ponder界面渲染脚本(/ponder/index.js) =>插入body<br>-加载表格样式表./chest.css';
  const script = document.createElement('script');
  script.src = './ponder/index.js';
  body.appendChild(script);
}
//endregion

//region options
const optionsPage = document.getElementById('options-page');
//为下列id的元素添加监听器，使状态实时刷新
const optionAddListenerIds = ['sti-moreooops'];
const options = {
  show: async function(){
  this.handleChange = function (e) { //重写逻辑（优化）
    if (!e.target.classList.contains('canClick')) return;//如果不是可点击元素-class=canClick（处理非btn元素）,直接返回
    const sti = e.target.closest('.setting-item');
    if (!sti) return; //如果不是setting-item元素,直接返回
    const sIType = sti.dataset.type;
    switch(sIType){
      case 'range':
          options.render.range(sti);
        break;
      case 'checkbox':
          // 当复选框类型改变时，调用select方法
          if(optionAddListenerIds.includes(sti.id)){
            options.render.select(sti.id);
          }
        break;
    }
  }
  if (!LS_accept) {
    const accept = await askLocalStorage('本界面使用LocalStorage储存桶来存储设置配置。是否启用LocalStorage?');
    if (accept) return;
    options.hide();
    return;
  }else{
    options.load();
  }
  title_main.style.display = 'none';
  optionsPage.style.display = 'block';
  optionsPage.addEventListener('change', this.handleChange);
  },
  hide: function(){
  optionsPage.removeEventListener('change', this.handleChange);
  title_main.style.display = 'flex';
  optionsPage.style.display = 'none';
  },
  load: function(){
  if(!LS_accept) return;
  const stiObj = JSON.parse( localStorage.getItem('sti') );
  if (!stiObj) return;//检查是否转JSON成功
  stiObj.forEach(function(i){//单个键值
    const sti = optionsPage.querySelector(`#${i.id}`);//sti=setting-item元素
    const sIType = sti.dataset.type;
    switch(sIType){
      case 'range':
        const sIInput = sti.querySelector('input');
        sIInput.value = i.value;
        options.render.range(sti);
      break;
      case 'checkbox':
        const Cbox = sti.querySelector('label').querySelector('input[type=checkbox]');
        Cbox.checked = i.value;
        if(optionAddListenerIds.includes(sti.id)){
          options.render.select(sti.id);
        }
      break;
      case 'select':
        const sISelect = sti.querySelector('select');
        sISelect.value = i.value;
      break;
    }
  });
  },
  save: function(){
  const sIs = optionsPage.querySelectorAll('.setting-item');
  let result = [];
  sIs.forEach(function(sI){
    const sIType = sI.dataset.type;
    switch(sIType){
    case 'range':
      const sIInput = sI.querySelector('input');
      result.push({id: sI.id,value: sIInput.value});
    break;
    case 'checkbox':
      const Cbox = sI.querySelector('label').querySelector('input[type=checkbox]');
      result.push({id: sI.id,value: Cbox.checked});
    break;
    case 'select':
      const sISelect = sI.querySelector('select');
      result.push({id: sI.id,value: sISelect.value});
    break;
    }
  });
  if(LS_accept){
    localStorage.setItem('sti', JSON.stringify(result));
  }
  },
  render: {//render:渲染动态更改的元素
    range: function(sti){//sti=setting-item元素,
      const id = sti.id;
      const sV = sti.querySelector('.setting-value');//设置中每项的值
      const value = sti.querySelector('input').value;//重新渲染画面
      switch(id){
        case 'sti-imgMirror':
          const t = ['Cloudflare Pages', 'Github Repositories(raw)', 'Gitee码云仓库', 'postimages.org', 'Auto自动']
          sV.textContent = t[value];
        break;
      }
    },
    select: function(id){
      switch(id){// 使用switch处理不同ID的情况
        case 'sti-moreooops':
          const sourceElement = document.getElementById('sti-ooops-source');
          const moreOoops = document.getElementById('sti-moreooops');
          const isChecked = moreOoops.querySelector('label').querySelector('input[type=checkbox]').checked;
          sourceElement.style.color = isChecked ? 'white' : '';
          sourceElement.classList.toggle('disabled', !isChecked);
          sourceElement.querySelector('select').disabled = !isChecked;
          break;
        // 可以在这里添加更多case来处理其他ID
        default:
          break;
      }
    }
  },
  btn: {
    showLSInfoSti: function(){
      const stiLSInfoSti = optionsPage.querySelector('.sti-LS-info-sti');
      const LSInfo = localStorage.getItem('sti') || 'LocalStorage.sti未储存任何数据';
      stiLSInfoSti.innerHTML = LSInfo;
    },
    showLSInfoAll: function(){
      const stiLSInfoAll = optionsPage.querySelector('.sti-LS-info-all');
      const LSInfo = JSON.stringify(localStorage) || 'LocalStorage未储存任何数据';
      stiLSInfoAll.innerHTML = LSInfo;
    },
    cleanLS: function(){
      localStorage.removeItem('sti');
      const stiLScleanSti = optionsPage.querySelector('.sti-LS-clean-sti');
      stiLScleanSti.innerHTML = 'LocalStorage.sti已清除';
    },
    cleanAllLS: function(){
      localStorage.clear();
      LS_accept = false;
      const stiLScleanAll = optionsPage.querySelector('.sti-LS-clean-all');
      const stiLScleanSti = optionsPage.querySelector('.sti-LS-clean-sti');
      stiLScleanSti.innerHTML = 'LocalStorage.sti已清除';
      stiLScleanAll.innerHTML = '所有LocalStorage已清除';
    },
  },
}
window.options = options;
//region 询问LocalStorage
const oLASection = document.getElementById('option-LS');
const oLAText = document.getElementById('oLA-text');
function askLocalStorage(text) {
  return new Promise((resolve) => {
    if (!LS_accept) {
      oLAText.innerHTML = text;
      oLASection.style.display = 'block';
      const handleClick = function (e) {
        if (e.target.id === 'oLA-accept-Btn') {
          LS_accept = true;
          localStorage.setItem('LS_accept', 'true');
          oLASection.style.display = 'none';
          oLASection.removeEventListener('click', handleClick);
          resolve(true);
        } else if (e.target.id === 'oLA-cancel-Btn') {
          LS_accept = false;
          oLASection.style.display = 'none';
          oLASection.removeEventListener('click', handleClick);
          resolve(false);
        }
      };
      oLASection.addEventListener('click', handleClick);
    } else {
      resolve(true);
    }
  });
}
//endregion