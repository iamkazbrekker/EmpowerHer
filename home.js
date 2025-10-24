document.addEventListener('DOMContentLoaded', function() {
    // Find the highest module number unlocked, default to 1
    const unlockedLevel = parseInt(localStorage.getItem('unlockedUpTo') || '1');

    // Get all the module elements
    const modules = document.querySelectorAll('.module');

    modules.forEach(module => {
        // Get the module number and video URL from the div
        const moduleNumber = parseInt(module.className.match(/module-(\d+)/)[1]);
        const icon = module.querySelector('i');
        const videoUrl = module.dataset.videoUrl; // Get URL from data-video-url attribute

        // A flag to check if the module should be clickable
        let isClickable = false;

        // Determine the module's state (completed, unlocked, or locked)
        if (moduleNumber < unlockedLevel) {
            // This module is COMPLETED
            module.classList.remove('locked', 'unlocked');
            module.classList.add('completed');
            icon.className = 'fas fa-check';
            isClickable = true; // Make it clickable

        } else if (moduleNumber === unlockedLevel) {
            // This is the NEXT module to be UNLOCKED
            module.classList.remove('locked', 'completed');
            module.classList.add('unlocked');
            icon.className = 'fas fa-play';
            isClickable = true; // Make it clickable

        } else {
            // This module is still LOCKED
            module.classList.remove('unlocked', 'completed');
            module.classList.add('locked');
            icon.className = 'fas fa-lock';
            // isClickable remains false, so it won't be made into a link

        }

        // *** NEW LOGIC: Only wrap the module in a link if it's clickable ***
        if (isClickable && videoUrl) {
            const link = document.createElement('a');
            link.href = videoUrl;
            
            // This clever trick wraps the module div with the new <a> tag
            module.parentNode.insertBefore(link, module);
            link.appendChild(module);
        }
    });
});
