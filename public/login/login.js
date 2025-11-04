// public/scripts/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('errorMessage');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';

    const email = (document.getElementById('email')?.value || '').trim();
    const password = (document.getElementById('password')?.value || '').trim();

    if (!email || !password) {
      errorDiv.textContent = 'Please enter both email and password.';
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.error || 'Login failed.';
        return;
      }

      // Redirect to home
      window.location.href = '../home/home.html';
    } catch (err) {
      console.error('Login error:', err);
      errorDiv.textContent = 'Network error. Please try again.';
    }
  });
});
