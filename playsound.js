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
volumeSlider.addEventListener('input', function () {
  const volume = parseFloat(volumeSlider.value);
  audio.volume = volume;
  soundstate.textContent = Math.round(volume * 100) + '%';
  volumeSlider.style.setProperty('--value', volumeSlider.value * 100 + '%'); // 移动到此处，每次滑块值改变时更新样式变量
  if (volume > 0) {
    if (audio.paused) {
      audio.play();
    }
  } else {
    audio.pause();
  }
});