// profile.js

document.addEventListener('DOMContentLoaded', async function() {
  // --- 1. DOM Element Selectors ---
  const usernameElement = document.querySelector('.profile-username');
  const userDateElement = document.querySelector('.profile-joindate');
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const expLabel = document.querySelector('.exp-labels span:last-child');

  // --- 2. Fetch user data from server (instead of localStorage) ---
  async function loadUserProfile() {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) {
        // If user is not authenticated, redirect to login
        window.location.href = '../login/index.html';
        return;
      }

      const data = await res.json();
      const user = data.user;

      // --- 3. Display User Info ---
      if (usernameElement && user.name) {
        usernameElement.textContent = user.name;
      }

      // Display DOB
      if (userDateElement) {
        if (user.dob) {
          const date = new Date(user.dob);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          userDateElement.textContent = `Born on ${date.toLocaleDateString(undefined, options)}`;
        } else {
          userDateElement.textContent = 'Date of birth not set';
        }
      }

      // --- 4. Display Progress ---
      const totalModules = 6;
      const expPerModule = 500;
      const unlockedLevel = parseInt(user.unlocked_upto || 1);
      const completedModules = Math.max(0, unlockedLevel - 1);
      const progressPercentage = (completedModules / totalModules) * 100;
      const currentExp = completedModules * expPerModule;
      const totalExpForLevel = totalModules * expPerModule;

      if (progressBarFill && expLabel) {
        progressBarFill.style.width = progressPercentage + '%';
        expLabel.textContent = `${currentExp} / ${totalExpForLevel}`;
      }

    } catch (err) {
      console.error('Error loading profile:', err);
      window.location.href = '../login/index.html';
    }
  }

  // --- 5. Initial Load ---
  loadUserProfile();
});
