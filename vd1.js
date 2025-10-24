// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 3. The API will call this function when the video player's state changes.
function onPlayerStateChange(event) {
  // YT.PlayerState.ENDED is the state for when the video finishes. Its value is 0.
  if (event.data == YT.PlayerState.ENDED) {
    showCompletionPopup();
  }
}

// 4. Function to show the popup
const popup = document.getElementById('completion-popup');
function showCompletionPopup() {
    if (popup) {
        popup.classList.add('visible');
    }
}

// 5. Function to hide the popup
function hideCompletionPopup() {
    if (popup) {
        popup.classList.remove('visible');
    }
}

// 6. Add event listeners to close the popup
const closeBtn = document.getElementById('popup-close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', hideCompletionPopup);
}

// Optional: Also close popup if the user clicks the overlay background
if (popup) {
    popup.addEventListener('click', function(event) {
        // Only close if the click is on the overlay itself, not the content inside
        if (event.target === popup) {
            hideCompletionPopup();
        }
    });
}

// --- ADD THIS AT THE END OF video-script.js ---

const continueBtn = document.getElementById('continue-btn');

if (continueBtn) {
  continueBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the link from navigating immediately

    // 1. Save progress. Let's say this video unlocks module 2.
    // We store that the user has unlocked everything UP TO module 2.
    localStorage.setItem('unlockedUpTo', '2');

    // 2. Redirect to the homepage
    window.location.href = 'home.html';
  });
}
