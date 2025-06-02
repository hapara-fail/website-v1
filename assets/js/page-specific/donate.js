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
        
        // Set initial state for feedback text if needed, though CSS handles initial hide
        if (feedbackTextSpan) feedbackTextSpan.style.display = 'none';


        button.addEventListener('click', () => {
            const targetId = button.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const addressToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(addressToCopy)
                    .then(() => {
                        if (defaultIcon) defaultIcon.style.display = 'none';
                        if (successIcon) successIcon.style.display = 'inline-block';
                        if (feedbackTextSpan) {
                            feedbackTextSpan.textContent = 'Copied!';
                            feedbackTextSpan.style.display = 'inline';
                        }
                        button.classList.add('copied');
                        button.setAttribute('disabled', 'true'); // Briefly disable button

                        setTimeout(() => {
                            if (defaultIcon) defaultIcon.style.display = 'inline-block';
                            if (successIcon) successIcon.style.display = 'none';
                            if (feedbackTextSpan) {
                                feedbackTextSpan.textContent = ''; 
                                feedbackTextSpan.style.display = 'none';
                            }
                            button.classList.remove('copied');
                            button.removeAttribute('disabled');
                        }, 2000); // Revert after 2 seconds
                    })
                    .catch(err => {
                        console.error('Failed to copy address: ', err);
                        if (feedbackTextSpan) {
                            feedbackTextSpan.textContent = 'Error!';
                            feedbackTextSpan.style.display = 'inline';
                             setTimeout(() => {
                                feedbackTextSpan.textContent = '';
                                feedbackTextSpan.style.display = 'none';
                            }, 2000);
                        } else {
                            // Fallback for users if feedbackTextSpan somehow isn't there
                            alert('Failed to copy address. Please copy it manually.');
                        }
                    });
            } else {
                console.error('Target element for copy not found:', targetId);
                if (feedbackTextSpan) {
                    feedbackTextSpan.textContent = 'Error!';
                    feedbackTextSpan.style.display = 'inline';
                    setTimeout(() => {
                        feedbackTextSpan.textContent = '';
                        feedbackTextSpan.style.display = 'none';
                    }, 2000);
                }
            }
        });
    });
});