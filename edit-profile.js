// edit-profile.js

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. DOM Element Selectors ---
    const editProfileForm = document.getElementById('editProfileForm');
    const nameInput = document.getElementById('editName');
    const dobInput = document.getElementById('editDob');

    // --- 2. Load existing data into the form fields ---
    function loadExistingData() {
        nameInput.value = localStorage.getItem('userName') || '';
        dobInput.value = localStorage.getItem('userDOB') || '';
    }

    // --- 3. Handle form submission ---
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Save name and DOB to local storage
        localStorage.setItem('userName', nameInput.value.trim());
        localStorage.setItem('userDOB', dobInput.value);

        // Redirect back to the profile page
        window.location.href = 'profile.html';
    });

    // --- 4. Initial Call ---
    loadExistingData();
});
