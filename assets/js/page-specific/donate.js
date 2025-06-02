// assets/js/page-specific/donate.js
// Handles "Copy to Clipboard" functionality for donation addresses.

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    if (!navigator.clipboard) {
        // Clipboard API not available (e.g., insecure context, older browser)
        // Optionally hide all copy buttons or provide alternative instructions
        copyButtons.forEach(button => {
            button.style.display = 'none'; // Hide buttons if API not supported
        });
        console.warn("Clipboard API not available. Copy buttons hidden.");
        return;
    }

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const addressToCopy = targetElement.textContent.trim();
                navigator.clipboard.writeText(addressToCopy)
                    .then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        button.classList.add('copied'); // For CSS styling feedback

                        // Revert button text after a delay
                        setTimeout(() => {
                            button.textContent = originalText;
                            button.classList.remove('copied');
                        }, 2000); // Revert after 2 seconds
                    })
                    .catch(err => {
                        console.error('Failed to copy address: ', err);
                        // Fallback for users, though navigator.clipboard.writeText is widely supported on secure contexts
                        alert('Failed to copy address automatically. Please select and copy manually.');
                    });
            } else {
                console.error('Target element for copy not found:', targetId);
            }
        });
    });
});