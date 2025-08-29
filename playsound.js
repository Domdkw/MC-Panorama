const audio = document.getElementById('Playmusic');
const soundstate = document.getElementById('sound_state');
const volumeSlider = document.getElementById('volume_slider');
const audioFiles = [
  "Mutation.mp3",
  "Beginning_2.mp3",
  "Floating_trees.mp3"
];

const randomIndex = Math.floor(Math.random() * audioFiles.length);
const selectedAudioFile = audioFiles[randomIndex];
terminal.innerHTML = '音频文件：<a href="./assets/sound/'+selectedAudioFile+'">'+selectedAudioFile+'</a>';

let currentVolume = parseFloat(volumeSlider.value);

// 定义一个变量来保存点击音效的 Audio 对象
let clickAudio = null;
audio.src = './assets/sound/'+selectedAudioFile;
//检查滑块是否改变（!==0）
if (volumeSlider.value !== 0) Playmusic();

//侦听滑块状态，改变音量
volumeSlider.addEventListener('input', ()=>Playmusic());

function Playmusic(){
  currentVolume = parseFloat(volumeSlider.value); // 更新当前音量值
  audio.volume = currentVolume;
  soundstate.textContent = Math.round(currentVolume * 100) + '%';
  if (currentVolume > 0) {
    if (audio.paused) {
      audio.play();
    }
  } else {
    audio.pause();
  }
}

//点击音乐
body.addEventListener('click', function (Click_ogg) {
  const Click_ogg_button = Click_ogg.target.closest('button') || Click_ogg.target.closest('.canClick'); // 查找最近的按钮元素
  if (Click_ogg_button) {
    if (currentVolume > 0) {
      if (!clickAudio) {
        // 如果 clickAudio 还没有创建，则创建一个新的 Audio 对象
        clickAudio = new Audio('./assets/sound/Click.ogg.mp3');
      }
      clickAudio.volume = currentVolume;
      if (clickAudio.paused) {
        clickAudio.currentTime = 0;
        clickAudio.play();
      }
    }
  }
});