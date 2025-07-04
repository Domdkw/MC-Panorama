const bodyElement = document.body;
const title_main = document.getElementById("title");

//region language

const nav_lang = navigator.language;
const lang_support = ["en-US","zh-TW","zh-CN"];
let uselang = nav_lang;

let jsonObject;
if(lang_support.includes(nav_lang) && nav_lang !== 'zh-CN'){
  window.onload = function(){
    fetch('./lang/' + nav_lang + '.json')
    .then(response => response.json())
    .then(data => {
      jsonObject = Array.isArray(data)? data : [data];
      handleLanguageData(jsonObject);
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
let spanId = nav_lang;
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
    fetch('./lang/' + spanId + '.json')
    .then(response => response.json())
    .then(data => {
      jsonObject = Array.isArray(data)? data : [data];
      handleLanguageData(jsonObject);
      uselang = spanId;
    })
    .catch(error => console.error('Can not get language profile,Error:', error));
  }
  if(ttf_usestate_text){
    bodyElement.style.fontFamily = "'Minecraft-Regular', sans-serif";
  }else{
    bodyElement.style.fontFamily = "sans-serif";
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
ooops.style.right = `-${ooops.offsetWidth/3}px`;
ooops.style.fontSize = `${-0.7*ooops.textContent.length +46.9}px`;
//endregion

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
      FSS(jsonData);
    })
    .catch(error => {
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
      FSS(jsonData);
    })
    .catch(error => {
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
//region options
const optionspage = document.getElementById('options-page');
function options(show){
  if(show){
    title_main.style.display = 'none';
    optionspage.style.display = 'block';
  }else{
    title_main.style.display = 'flex';
    optionspage.style.display = 'none';
  }
}
//endregion
//region Create
function create(){
  title_main.style.display = 'none';
  loadingDiv.style.display = 'flex';
  setTimeout(() => {
    loadingDiv.style.opacity = '1';
  },100)
  while (loadingDiv.childNodes.length > 1) {
    loadingDiv.removeChild(loadingDiv.lastChild);
  }
  loadFile('./ponder/ponder.js', 'js', true);
  //loadFile('./ponder/item.css', 'css', true);
  const itemDiv = document.createElement('div');
  itemDiv.id = 'item-list';
  itemDiv.classList.add('dirt','abso');
  document.body.appendChild(itemDiv);
  setTimeout(() => {
    loadingDiv.style.opacity = '0';
    itemDiv.classList.add('ponderDiv');
    setTimeout(() => {
      loadingDiv.style.display = 'none';
    }, 1000); // 等待渐隐动画完成
  }, 1000); // 加载完成后等待1秒
}