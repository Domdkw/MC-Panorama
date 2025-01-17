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
audio.src = selectedAudioFile;

// 定义一个变量来保存当前滑块的音量值
let currentVolume = parseFloat(volumeSlider.value);

// 定义一个变量来保存点击音效的 Audio 对象
let clickAudio = null;

volumeSlider.addEventListener('input', function () {
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
});

document.body.addEventListener('click', function (Click_ogg) {
  if (Click_ogg.target.tagName === 'BUTTON') {
    if (currentVolume > 0) { // 只有在音量大于 0 时才处理点击音效
      if (!clickAudio) {
        // 如果 clickAudio 还没有创建，则创建一个新的 Audio 对象
        clickAudio = new Audio('Click.ogg.mp3');
      }
      clickAudio.volume = currentVolume;
      if (clickAudio.paused) {
        clickAudio.currentTime = 0; // 重置播放时间到开头
        clickAudio.play();
      }
    }
  }
});