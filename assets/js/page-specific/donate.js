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
        const originalTitle = button.getAttribute('title'); // Store original title

        button.addEventListener('click', () => {
            const targetId = button.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const addressToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(addressToCopy)
                    .then(() => {
                        button.setAttribute('title', 'Copied!');
                        button.classList.add('copied'); // CSS will handle icon swap
                        button.setAttribute('disabled', 'true');

                        setTimeout(() => {
                            button.setAttribute('title', originalTitle);
                            button.classList.remove('copied'); // CSS will revert icon
                            button.removeAttribute('disabled');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy address: ', err);
                        button.setAttribute('title', 'Copy failed!');
                        // Optionally, add an error class for visual feedback
                        // button.classList.add('copy-error'); 
                        setTimeout(() => {
                            button.setAttribute('title', originalTitle);
                            // button.classList.remove('copy-error');
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