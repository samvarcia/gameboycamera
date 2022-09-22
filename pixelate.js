const pixelatedImage = new Image();
pixelatedImage.src = "pixelsample.png";
const originalImage = pixelatedImage.cloneNode(true);
const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

pixelatedImage.addEventListener("load", function () {
  context.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

  const scannedImage = context.getImageData(0, 0, canvas.width, canvas.height);
  const scannedData = scannedImage.data;
  const pixelationFactor = 3;
  for (let i = 0; i < scannedData.length; i += 4) {
    const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
    const averageColorValue = total / 3;
    scannedData[i] = averageColorValue;
    scannedData[i + 1] = averageColorValue + 60;
    scannedData[i + 2] = averageColorValue;
  }
  for (let y = 0; y < canvas.height; y += pixelationFactor) {
    for (let x = 0; x < canvas.width; x += pixelationFactor) {
      // extracting the position of the sample pixel
      const pixelIndexPosition = (x + y * canvas.width) * 4;
      // drawing a square replacing the current pixels
      context.fillStyle = `rgba(
        ${scannedData[pixelIndexPosition]},
        ${scannedData[pixelIndexPosition + 1]},
        ${scannedData[pixelIndexPosition + 2]},
        ${scannedData[pixelIndexPosition + 3]}
        )`;
      context.fillRect(x, y, pixelationFactor, pixelationFactor);
    }
  }

  pixelatedImage.src = canvas.toDataURL();
});
