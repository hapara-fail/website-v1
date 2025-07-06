// assets/js/page-specific/bypass.js

document.addEventListener('DOMContentLoaded', () => {
  const osDetectionMessage = document.getElementById('os-detection-message');
  
  function detectOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();
    let detectedOS = null;

    if (/mac|macintel|macppc|mac68k/.test(platform)) {
      detectedOS = 'macos';
    } else if (/win32|win64|windows|wince/.test(platform)) {
      detectedOS = 'windows';
    } else if (/iphone|ipad|ipod/.test(platform) || (userAgent.includes("mac") && "ontouchend" in document)) {
      detectedOS = 'ios';
    } else if (userAgent.includes("cros")) {
      detectedOS = 'chromeos';
    } else if (/android/.test(userAgent)) {
      detectedOS = 'android';
    } else if (/linux/.test(platform)) {
      detectedOS = 'linux';
    }
    
    return detectedOS;
  }

  function expandInstructionsForOS(os) {
    if (os) { // If an OS was detected
        const detailsElement = document.getElementById(`os-${os}`);
        if (detailsElement) {
            detailsElement.open = true;
            
            // Display the specific OS detection message
            if (osDetectionMessage) {
                let osName = os.charAt(0).toUpperCase() + os.slice(1);
                if (os === 'ios') osName = 'iOS / iPadOS';
                if (os === 'macos') osName = 'macOS';
                if (os === 'chromeos') osName = 'ChromeOS';
                
                osDetectionMessage.innerHTML = `We've detected you're on <strong>${osName}</strong> and have opened the relevant instructions for you.`;
                osDetectionMessage.style.display = 'block';
            }
        }
    } else { // If no OS was detected, show the fallback message
        if (osDetectionMessage) {
            osDetectionMessage.innerHTML = `We couldn't automatically detect your OS. Please select it from the list below.`;
            osDetectionMessage.style.display = 'block';
        }
    }
  }

  const detectedOS = detectOS();
  expandInstructionsForOS(detectedOS);
});