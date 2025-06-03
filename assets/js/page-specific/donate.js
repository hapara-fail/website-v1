// assets/js/page-specific/donate.js
// Handles "Copy to Clipboard" functionality for donation addresses with icon feedback.

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    if (!navigator.clipboard) {
        copyButtons.forEach(button => {
            button.style.display = 'none'; 
        });
        console.warn("Clipboard API not available. Copy buttons may be hidden or non-functional.");
        return;
    }

    copyButtons.forEach(button => {
        // Note: default-icon and success-icon are classes on spans *inside* the button in the HTML
        // The JS will toggle the 'copied' class on the button itself, CSS handles icon visibility
        const originalTitle = button.getAttribute('title'); 

        button.addEventListener('click', () => {
            const targetId = button.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const addressToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(addressToCopy)
                    .then(() => {
                        button.setAttribute('title', 'Copied!');
                        button.classList.add('copied'); // CSS will use this to show checkmark and hide copy icon
                        button.setAttribute('disabled', 'true'); // Briefly disable to prevent rapid clicks

                        setTimeout(() => {
                            button.setAttribute('title', originalTitle); // Restore original title
                            button.classList.remove('copied'); // CSS will revert icons
                            button.removeAttribute('disabled');
                        }, 2000); // Revert after 2 seconds
                    })
                    .catch(err => {
                        console.error('Failed to copy address: ', err);
                        button.setAttribute('title', 'Copy failed!');
                        // Optionally, you could add a temporary 'copy-error' class for visual feedback
                        setTimeout(() => {
                            button.setAttribute('title', originalTitle);
                        }, 2500);
                    });
            } else {
                console.error('Target element for copy not found:', targetId);
                button.setAttribute('title', 'Error: Target not found');
                 setTimeout(() => {
                    button.setAttribute('title', originalTitle);
                }, 2500);
            }
        });
    });
});