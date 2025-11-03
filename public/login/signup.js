document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  if (!name || !email || !password) {
    errorMessage.textContent = "Please fill in all fields.";
    return;
  }

  // Save data locally (for demo only — replace with backend later)
  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email);

  errorMessage.style.color = "lightgreen";
  errorMessage.textContent = "Signup successful! Redirecting...";

  // Redirect to login
  setTimeout(() => {
    window.location.href = "../home/home.html";
  }, 1000);
});
localStorage.setItem("userName", name);
localStorage.setItem("userEmail", email);
