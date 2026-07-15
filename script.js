document.addEventListener('DOMContentLoaded', () => {
  // 1. Get references to the HTML elements
  const inputText = document.getElementById('inputText');
  const qrSize = document.getElementById('qrSize');
  const qrImg = document.getElementById('qrImg');
  const downloadFormat = document.getElementById('downloadFormat');
  const downloadBtn = document.getElementById('downloadBtn');

  // 2. Function to generate and update the QR code image URL
  function refreshQR() {
    // Get text value, fallback to 'https://metamask.io' if empty
    const text = inputText.value.trim() || 'https://metamask.io';
    // Get size value, fallback to 250px
    const size = qrSize.value || 250;
    
    // Construct the API URL and set it as the src of the <img> tag
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}`;
  }

  // 3. Listen for changes in input fields to update the QR code in real-time
  [inputText, qrSize].forEach(el => el.addEventListener('input', refreshQR));
  
  // Render the initial QR code when the page loads
  refreshQR();

  // 4. Handle Download button click
  downloadBtn.addEventListener('click', async () => {
    const format = downloadFormat.value;

    if (format === 'pdf') {
      // PDF Option: Open the print dialog (which allows saving as PDF)
      window.print();
    } else {
      // PNG Option: Download the image from the API
      
      // Step A: Fetch the image file from the external URL
      const response = await fetch(qrImg.src);
      // Step B: Convert the response into raw binary data (Blob)
      const blob = await response.blob();
      
      // Step C: Create a temporary invisible <a> link in memory
      const link = document.createElement('a');
      // Step D: Create a local URL pointing to the binary Blob data
      link.href = URL.createObjectURL(blob);
      // Step E: Assign a filename with a unique timestamp
      link.download = `qrcode_${Date.now()}.png`;
      
      // Step F: Simulate a click on the link to trigger browser download
      link.click();
      // Step G: Revoke the local URL to free up system memory
      URL.revokeObjectURL(link.href);
    }
  });
});
