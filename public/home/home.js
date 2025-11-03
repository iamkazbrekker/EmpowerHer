document.addEventListener('DOMContentLoaded', function() {
    
    // Define the paths to your new SVG icons
    // Make sure these paths match where you saved your files
    const iconPaths = {
        completed: '../assets/check.svg',
        unlocked: '../assets/play.svg',
        locked: '../assets/lock.svg'
    };

    // Find the highest module number unlocked, default to 1
    const unlockedLevel = parseInt(localStorage.getItem('unlockedUpTo') || '1');

    // Get all the module elements
    const modules = document.querySelectorAll('.module');

    modules.forEach(module => {
        // Get the module number and video URL from the div
        const moduleNumber = parseInt(module.className.match(/module-(\d+)/)[1]);
        
        // **MODIFIED: Select the <img> tag using its class**
        const icon = module.querySelector('.module-icon'); 
        const videoUrl = module.dataset.videoUrl; // Get URL from data-video-url attribute

        // Safety check in case the icon img tag is missing
        if (!icon) {
            console.error('No .module-icon <img> tag found for module:', module);
            return; // Skip this module
        }

        // A flag to check if the module should be clickable
        let isClickable = false;
        let newIconSrc = '';
        let newAltText = '';

        // Determine the module's state (completed, unlocked, or locked)
        if (moduleNumber < unlockedLevel) {
            // This module is COMPLETED
            module.classList.remove('locked', 'unlocked');
            module.classList.add('completed');
            
            // **MODIFIED: Set src and alt text**
            newIconSrc = iconPaths.completed;
            newAltText = 'Module Completed';
            isClickable = true; // Make it clickable

        } else if (moduleNumber === unlockedLevel) {
            // This is the NEXT module to be UNLOCKED
            module.classList.remove('locked', 'completed');
            module.classList.add('unlocked');
            
            // **MODIFIED: Set src and alt text**
            newIconSrc = iconPaths.unlocked;
            newAltText = 'Play Module';
            isClickable = true; // Make it clickable

        } else {
            // This module is still LOCKED
            module.classList.remove('unlocked', 'completed');
            module.classList.add('locked');
            
            // **MODIFIED: Set src and alt text**
            newIconSrc = iconPaths.locked;
            newAltText = 'Module Locked';
            // isClickable remains false, so it won't be made into a link
        }

        // **MODIFIED: Apply the new src and alt attributes to the <img> tag**
        icon.src = newIconSrc;
        icon.alt = newAltText;

        // *** This logic remains the same ***
        // Only wrap the module in a link if it's clickable
        if (isClickable && videoUrl) {
            const link = document.createElement('a');
            link.href = videoUrl;
            
            // This clever trick wraps the module div with the new <a> tag
            module.parentNode.insertBefore(link, module);
            link.appendChild(module);
        }
    });
});