//region language

const nav_lang = navigator.language;
const lang_support = ["en-US"];
if(lang_support.includes(nav_lang)){
  let jsonObject;
  window.onload = function(){
    fetch('./lang/' + nav_lang + '.json')
    .then(response => response.json())
    .then(data => {
      jsonObject = Array.isArray(data)? data : [data];
      handleLanguageData(jsonObject);
    })
    .catch(error => console.error('Error fetching JSON:', error));
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
    }//handleLanguageData
  }//onload
}//if

//endregion