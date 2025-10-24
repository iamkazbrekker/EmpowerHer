var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    showCompletionPopup();
  }
}

const popup = document.getElementById('completion-popup');
function showCompletionPopup() {
    if (popup) {
        popup.classList.add('visible');
    }
}

function hideCompletionPopup() {
    if (popup) {
        popup.classList.remove('visible');
    }
}

const closeBtn = document.getElementById('popup-close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', hideCompletionPopup);
}

if (popup) {
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            hideCompletionPopup();
        }
    });
}

const continueBtn = document.getElementById('continue-btn');
if (continueBtn) {
  continueBtn.addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.setItem('unlockedUpTo', '6'); // Unlocks Module 6
    window.location.href = 'home.html';
  });
}
