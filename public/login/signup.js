// public/scripts/signup.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const message = document.getElementById('errorMessage');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const password = (document.getElementById('password')?.value || '').trim();

    if (!name || !email || !password) {
      message.textContent = 'Please fill in all fields.';
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error || 'Signup failed.';
        return;
      }

      message.style.color = 'green';
      message.textContent = 'Signup successful! Redirecting to login...';
      setTimeout(() => {
        window.location.href = '/login/index.html';
      }, 1000);
    } catch (err) {
      console.error(err);
      message.textContent = 'Network error. Please try again.';
    }
  });
});
