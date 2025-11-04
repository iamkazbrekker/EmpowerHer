// public/profile/edit-profile.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editProfileForm');
  const message = document.getElementById('profileMessage');
  const nameInput = document.getElementById('editName');
  const dobInput = document.getElementById('editDob');

  // --- Load current profile data ---
  async function loadProfile() {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) {
        // Not logged in — redirect
        window.location.href = '../login/login.html';
        return;
      }

      const { user } = await res.json();
      if (nameInput) nameInput.value = user.name || '';
      if (dobInput) dobInput.value = user.dob || '';
    } catch (err) {
      console.error('Failed to load user data:', err);
      window.location.href = '../login/login.html';
    }
  }

  // --- Handle form submission ---
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';

      const updates = {
        name: nameInput?.value?.trim(),
        dob: dobInput?.value || null,
      };

      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        const data = await res.json();

        if (!res.ok) {
          message.style.color = 'red';
          message.textContent = data.error || 'Update failed.';
          return;
        }

        message.style.color = 'limegreen';
        message.textContent = 'Profile updated successfully!';
      } catch (err) {
        console.error('Error updating profile:', err);
        message.style.color = 'red';
        message.textContent = 'Network error. Please try again.';
      }
    });
  }

  // --- Initialize ---
  loadProfile();
});
