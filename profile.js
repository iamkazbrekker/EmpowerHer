// profile.js

document.addEventListener('DOMContentLoaded', function() {

  // --- 1. DOM Element Selectors ---
  const usernameElement = document.querySelector('.profile-username');
  const userDateElement = document.querySelector('.profile-joindate');
  // The 'avatarElement' is no longer needed
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const expLabel = document.querySelector('.exp-labels span:last-child');

  // --- 2. Function to load all user data from localStorage ---
  function loadUserProfile() {
    // Load Name
    const storedName = localStorage.getItem('userName');
    if (usernameElement && storedName) {
      usernameElement.textContent = storedName;
    }

    // Load Date of Birth
    const storedDob = localStorage.getItem('userDOB');
    if (userDateElement && storedDob) {
      const date = new Date(storedDob);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      userDateElement.textContent = `Born on ${date.toLocaleDateString(undefined, options)}`;
    } else {
        userDateElement.textContent = "Date of birth not set";
    }

    // Avatar loading logic has been removed

    // Load Progress Bar
    const totalModules = 6;
    const expPerModule = 500;
    const unlockedLevel = parseInt(localStorage.getItem('unlockedUpTo') || '1');
    const completedModules = Math.max(0, unlockedLevel - 1);
    const progressPercentage = (completedModules / totalModules) * 100;
    const currentExp = completedModules * expPerModule;
    const totalExpForLevel = totalModules * expPerModule;

    if (progressBarFill && expLabel) {
      progressBarFill.style.width = progressPercentage + '%';
      expLabel.textContent = `${currentExp} / ${totalExpForLevel}`;
    }
  }

  // --- 3. Initial Call ---
  loadUserProfile();
});
