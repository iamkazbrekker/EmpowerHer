// video-script.js

// --- 1. Load the YouTube IFrame API ---
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// --- 2. Define video and title data ---
const links = [
  "https://www.youtube.com/embed/qM9KRfpZmIg?start=57&enablejsapi=1&end=210",
  "https://www.youtube.com/embed/eUikQsy3Cmw?start=57&enablejsapi=1&end=403",
  "https://www.youtube.com/embed/AvC0vuaEzkI?start=57&enablejsapi=1&end=554",
  "https://www.youtube.com/embed/OYGCV74sofE?start=57&enablejsapi=1&end=341",
  "https://www.youtube.com/embed/O5iml428XgI?start=57&enablejsapi=1&end=458",
  "https://www.youtube.com/embed/q1H4eGYTGQE?start=57&enablejsapi=1&end=281"
];

const headings = [
  "Module 1: Hair Grab",
  "Module 2: Wrist Grab",
  "Module 3: Shoulder Grab",
  "Module 4: Defending Yourself From Ground",
  "Module 5: The 3 Moves",
  "Module 6: Self Defence Moves To Avoid"
];

// --- 3. DOM Elements ---
const wrapper = document.getElementsByClassName("video-player-wrapper")[0];
const head = document.getElementsByClassName('video-title')[0];
const popup = document.getElementById('completion-popup');
const closeBtn = document.getElementById('popup-close-btn');
const continueBtn = document.getElementById('continue-btn');

let player;
let unlockedLevel = 1;

// --- 4. Load user progress from database ---
async function loadUnlockedLevel() {
  try {
    const res = await fetch('/api/unlocked');
    if (!res.ok) {
      // Not logged in or unauthorized → redirect
      window.location.href = '../login/index.html';
      return;
    }
    const data = await res.json();
    unlockedLevel = parseInt(data.unlocked_upto || 1);

    // Render the video and heading for this level
    renderVideo(unlockedLevel);
  } catch (err) {
    console.error('Error fetching unlocked level:', err);
    window.location.href = '../login/index.html';
  }
}

// --- 5. Render current module video and heading ---
function renderVideo(level) {
  if (!wrapper) return;

  const videoSrc = links[level - 1] || links[0];
  wrapper.innerHTML = `
    <iframe 
      id="video-player" 
      width="560" 
      height="315" 
      src="${videoSrc}" 
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;

  if (head) head.innerText = headings[level - 1] || 'Self Defence Module';

  // After embedding, rebind player event once API is ready
  if (typeof YT !== "undefined" && YT.Player) {
    player = new YT.Player('video-player', {
      events: { 'onStateChange': onPlayerStateChange }
    });
  }
}

// --- 6. YouTube API Ready ---
function onYouTubeIframeAPIReady() {
  // Player will be initialized after renderVideo() runs
}

// --- 7. Handle video end event ---
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    showCompletionPopup();
  }
}

// --- 8. Popup Controls ---
function showCompletionPopup() {
  if (popup) popup.classList.add('visible');
}

function hideCompletionPopup() {
  if (popup) popup.classList.remove('visible');
}

if (closeBtn) {
  closeBtn.addEventListener('click', hideCompletionPopup);
}

if (popup) {
  popup.addEventListener('click', function (event) {
    if (event.target === popup) hideCompletionPopup();
  });
}

// --- 9. Handle Continue Button ---
if (continueBtn) {
  continueBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    try {
      const nextLevel = unlockedLevel + 1;
      const res = await fetch('/api/unlocked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlocked_upto: nextLevel })
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Error updating progress:', data.error);
        alert('Error updating progress. Please try again.');
        return;
      }

      // Redirect after saving progress
      window.location.href = '/home/home.html';
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Please try again.');
    }
  });
}

// --- 10. Initialize ---
loadUnlockedLevel();
