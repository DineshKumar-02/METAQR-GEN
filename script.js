/**
 * MetaQR Code Generator
 * Client-side offline generation & high-fidelity downloading logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const inputText = document.getElementById('inputText');
  const qrSize = document.getElementById('qrSize');
  const fgColor = document.getElementById('fgColor');
  const bgColor = document.getElementById('bgColor');
  const qrCanvas = document.getElementById('qrCanvas');
  
  const welcomeModal = document.getElementById('welcomeModal');
  const dismissModalBtn = document.getElementById('dismissModalBtn');
  
  const downloadFormat = document.getElementById('downloadFormat');
  const downloadBtn = document.getElementById('downloadBtn');

  // Welcome Modal Logic with persistent dismiss using localStorage
  if (localStorage.getItem('metaqr_welcome_dismissed')) {
    welcomeModal.style.display = 'none';
  } else {
    welcomeModal.style.display = 'flex';
  }

  dismissModalBtn.addEventListener('click', () => {
    // Fade out modal and mark dismissed
    welcomeModal.style.opacity = '0';
    setTimeout(() => {
      welcomeModal.style.display = 'none';
      localStorage.setItem('metaqr_welcome_dismissed', 'true');
    }, 400);
  });

  // Initialize QRious Generator (offline/local canvas drawing)
  const qr = new QRious({
    element: qrCanvas,
    value: inputText.value,
    size: parseInt(qrSize.value) || 250,
    foreground: fgColor.value,
    background: bgColor.value,
    level: 'H' // High error-correction capability
  });

  /**
   * Reads control states and refreshes the canvas representation
   */
  function refreshQR() {
    const textVal = inputText.value.trim();
    
    // Set a neat fallback if the user clears the input
    qr.value = textVal || 'https://metamask.io';
    qr.size = parseInt(qrSize.value) || 250;
    qr.foreground = fgColor.value;
    qr.background = bgColor.value;
  }

  // Real-time Event Binding
  inputText.addEventListener('input', refreshQR);
  qrSize.addEventListener('input', refreshQR);
  fgColor.addEventListener('input', refreshQR);
  bgColor.addEventListener('input', refreshQR);

  // Download Trigger Handler
  downloadBtn.addEventListener('click', () => {
    const selectedFormat = downloadFormat.value;
    const currentText = inputText.value.trim();
    
    // Construct a clean, alphanumeric file suffix based on input text
    const suffix = currentText 
      ? currentText.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 20) 
      : 'metaqr';
    const timestamp = Date.now();
    const filename = `qr_${suffix}_${timestamp}`;

    if (selectedFormat === 'png' || selectedFormat === 'jpeg') {
      const mime = selectedFormat === 'png' ? 'image/png' : 'image/jpeg';
      
      // Extract data URL from active canvas rendering
      const url = qrCanvas.toDataURL(mime);
      
      // Programmatically trigger a link download click
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${filename}.${selectedFormat}`;
      downloadLink.click();
    } else if (selectedFormat === 'pdf') {
      // Trigger native browser printer. 
      // Print styles (@media print) isolate the canvas and hide web UI automatically.
      window.print();
    }
  });
});
