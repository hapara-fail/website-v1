// assets/js/page-specific/donate.js
// Handles "Copy to Clipboard" functionality for donation addresses with icon feedback.

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    if (!navigator.clipboard) {
        copyButtons.forEach(button => {
            button.style.display = 'none'; 
        });
        console.warn("Clipboard API not available. Copy buttons hidden.");
        return;
    }

    copyButtons.forEach(button => {
        const defaultIcon = button.querySelector('.default-icon');
        const successIcon = button.querySelector('.success-icon');
        const feedbackTextSpan = button.querySelector('.copy-feedback-text');
        const initialButtonWidth = button.offsetWidth; // Store initial width
        
        // Set initial accessible text for the button if not using aria-label already for the icon itself
        if (feedbackTextSpan) {
            // The button's aria-label already describes the action, so text can be minimal or for visual state
            // For this setup, we'll make the text span show "Copy" initially if no icon text is used
            // However, since icons are present, the aria-label on the button is primary.
            // We will use the feedbackTextSpan for "Copied!" message.
        }


        button.addEventListener('click', () => {
            // Prevent button from permanently changing size if text appears
            button.style.minWidth = `${initialButtonWidth}px`;

            const targetId = button.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const addressToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(addressToCopy)
                    .then(() => {
                        if (defaultIcon) defaultIcon.style.display = 'none';
                        if (successIcon) successIcon.style.display = 'inline-block'; // Or 'block'
                        if (feedbackTextSpan) {
                            feedbackTextSpan.textContent = 'Copied!';
                            feedbackTextSpan.style.display = 'inline';
                        }
                        button.classList.add('copied'); // For CSS styling feedback (e.g. background)

                        setTimeout(() => {
                            if (defaultIcon) defaultIcon.style.display = 'inline-block'; // Or 'block'
                            if (successIcon) successIcon.style.display = 'none';
                            if (feedbackTextSpan) {
                                feedbackTextSpan.textContent = ''; // Or back to "Copy" if you had it
                                feedbackTextSpan.style.display = 'none';
                            }
                            button.classList.remove('copied');
                            button.style.minWidth = ''; // Reset min-width
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy address: ', err);
                        if (feedbackTextSpan) {
                            feedbackTextSpan.textContent = 'Error';
                            feedbackTextSpan.style.display = 'inline';
                             setTimeout(() => {
                                feedbackTextSpan.textContent = '';
                                feedbackTextSpan.style.display = 'none';
                            }, 2000);
                        } else {
                            alert('Failed to copy address. Please copy it manually.');
                        }
                    });
            } else {
                console.error('Target element for copy not found:', targetId);
                if (feedbackTextSpan) feedbackTextSpan.textContent = 'Error';
            }
        });
    });
});