document.addEventListener('DOMContentLoaded', () => {
  // 1. Get the elements from the HTML page
  const inputText = document.getElementById('inputText');
  const qrSize = document.getElementById('qrSize');
  const qrImg = document.getElementById('qrImg');
  const downloadFormat = document.getElementById('downloadFormat');
  const downloadBtn = document.getElementById('downloadBtn');

  // 2. This function updates the QR code image on the screen
  function updateQRCode() {
    // Get text value, use 'https://metamask.io' if empty
    const text = inputText.value.trim() || 'https://metamask.io';
    // Get size value, use 250 as default
    const size = qrSize.value || 250;
    
    // Get the QR code image from a free online API
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}`;
  }

  // 3. Update the QR code whenever the user types or changes the size
  inputText.addEventListener('input', updateQRCode);
  qrSize.addEventListener('input', updateQRCode);
  
  // Show the QR code when the page first loads
  updateQRCode();

  // 4. When the user clicks the "Download QR Code" button
  downloadBtn.addEventListener('click', () => {
    if (downloadFormat.value === 'pdf') {
      // If PDF is selected, open the browser print page
      window.print();
    } else {
      // If PNG is selected, open the QR image in a new tab so user can right-click and save it
      window.open(qrImg.src, '_blank');
    }
  });
});

