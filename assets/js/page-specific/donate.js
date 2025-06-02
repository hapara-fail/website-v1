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
        const defaultIcon = button.querySelector('.default-icon');
        const successIcon = button.querySelector('.success-icon');
        // const feedbackTextSpan = button.querySelector('.copy-feedback-text'); // Removed as per new design
        const originalTitle = button.getAttribute('title'); // Store original title

        button.addEventListener('click', () => {
            const targetId = button.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const addressToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(addressToCopy)
                    .then(() => {
                        if (defaultIcon) defaultIcon.style.display = 'none';
                        if (successIcon) successIcon.style.display = 'inline-block'; // Or 'flex' if icon-wrapper is flex
                        
                        button.setAttribute('title', 'Copied!');
                        button.classList.add('copied');
                        button.setAttribute('disabled', 'true'); // Briefly disable to prevent rapid clicks

                        setTimeout(() => {
                            if (defaultIcon) defaultIcon.style.display = 'inline-block'; // Or 'flex'
                            if (successIcon) successIcon.style.display = 'none';
                            
                            button.setAttribute('title', originalTitle); // Restore original title
                            button.classList.remove('copied');
                            button.removeAttribute('disabled');
                        }, 2000); // Revert after 2 seconds
                    })
                    .catch(err => {
                        console.error('Failed to copy address: ', err);
                        button.setAttribute('title', 'Copy failed!');
                        // Optionally add a visual error state to the button if desired
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