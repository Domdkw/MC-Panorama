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

const clickAudio = new Audio('Click.ogg.mp3');
const clickVolume = 0.5;
clickAudio.volume = clickVolume;

volumeSlider.addEventListener('input', function () {
  const volume = parseFloat(volumeSlider.value);
  audio.volume = volume;
  soundstate.textContent = Math.round(volume * 100) + '%';
  if (volume > 0) {
    if (audio.paused) {
      audio.play();
    }
  } else {
    audio.pause();
  }
});

document.body.addEventListener('click', function (Click_ogg) {
  if (Click_ogg.target.tagName === 'BUTTON') {
    if (clickVolume > 0) {
      if (clickAudio.paused) {
        clickAudio.currentTime = 0; // 重置播放位置
        clickAudio.play();
      }
    } else {
      clickAudio.pause();
    }
  }
});