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
    const volume = 0.5;
    var Click_ogg_audio = new Audio('Click.ogg.mp3');
    Click_ogg_audio.volume = volume;
    if (volume > 0) {
      if (Click_ogg_audio.paused) {
        Click_ogg_audio.play();
      }
    } else {
      Click_ogg_audio.pause();
    }
  }
});
