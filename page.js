const bodyElement = document.body;

//region language

const nav_lang = navigator.language;
const lang_support = ["en-US","zh-TW"];
let jsonObject;
if(lang_support.includes(nav_lang)){
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
const title_main = document.getElementById("title");
let spanId = nav_lang;
function showlang(){
  title_main.style.display = "none";
  lang_choose_div.style.display = "flex";
  let current_langspan = document.getElementById(spanId);
  current_langspan.classList.add('clicked');
  const languageList = document.querySelector('.language-list');

  languageList.addEventListener('click', function (langspan) {
    if (langspan.target.tagName === 'SPAN') {
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
  if(lang_support.includes(spanId)){
    fetch('./lang/' + spanId + '.json')
    .then(response => response.json())
    .then(data => {
      jsonObject = Array.isArray(data)? data : [data];
      handleLanguageData(jsonObject);
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
    styleSheet.sheet.insertRule('@font-face {font-family: "Minecraft-Regular";src: url("./Minecraft-Regular.otf") format("opentype");}');
  }
  ttf_usestate_text = !ttf_usestate_text;
  if(ttf_usestate_text){
    ttf_usestate_element.textContent = 'on';
  }else{
    ttf_usestate_element.textContent = 'off'
  }
}
//endregion
