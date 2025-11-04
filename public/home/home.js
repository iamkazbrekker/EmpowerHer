// home.js — EmpowerHer module unlock system (database-integrated)

document.addEventListener('DOMContentLoaded', async function () {
  // --- 1. Define icon paths (relative to your assets folder)
  const iconPaths = {
    completed: '../assets/check.svg',
    unlocked: '../assets/play.svg',
    locked: '../assets/lock.svg'
  };

  // --- 2. Get all module divs ---
  const modules = document.querySelectorAll('.module');

  // --- 3. Fetch progress (unlocked_upto) from server ---
  async function fetchProgress() {
    try {
      const res = await fetch('/api/unlocked'); // Your backend route
      if (!res.ok) {
        console.warn('User not authenticated — redirecting to login');
        window.location.href = '../login/index.html';
        return 1; // Default if unauthenticated
      }

      const data = await res.json();
      return parseInt(data.unlocked_upto || 1);
    } catch (err) {
      console.error('Error fetching user progress:', err);
      window.location.href = '../login/index.html';
      return 1;
    }
  }

  // --- 4. Render all modules based on unlocked level ---
  async function renderModules() {
    const unlockedLevel = await fetchProgress();

    modules.forEach((module) => {
      const moduleNumber = parseInt(module.className.match(/module-(\d+)/)[1]);
      const icon = module.querySelector('.module-icon');
      const videoUrl = module.dataset.videoUrl;
      let newIconSrc = '';
      let newAltText = '';
      let isClickable = false;

      // --- Determine module state ---
      if (moduleNumber < unlockedLevel) {
        // Completed
        module.classList.remove('locked', 'unlocked');
        module.classList.add('completed');
        newIconSrc = iconPaths.completed;
        newAltText = 'Module Completed';
        isClickable = true;
      } else if (moduleNumber === unlockedLevel) {
        // Current unlocked module
        module.classList.remove('locked', 'completed');
        module.classList.add('unlocked');
        newIconSrc = iconPaths.unlocked;
        newAltText = 'Play Module';
        isClickable = true;
      } else {
        // Locked
        module.classList.remove('unlocked', 'completed');
        module.classList.add('locked');
        newIconSrc = iconPaths.locked;
        newAltText = 'Module Locked';
      }

      // --- Update icon ---
      if (icon) {
        icon.src = newIconSrc;
        icon.alt = newAltText;
      }

      // --- Add click behavior for unlocked/completed modules ---
      if (isClickable && videoUrl) {
        module.style.cursor = 'pointer';
        module.onclick = () => {
          window.location.href = videoUrl.replace('vd1', `vd${moduleNumber}`);
        };
      } else {
        module.style.cursor = 'not-allowed';
        module.onclick = null;
      }
    });
  }

  // --- 5. Initialize rendering ---
  renderModules();
});
