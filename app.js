async function setupCamera() {
  let video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "environment",
      height: { ideal: 500 },
      width: { ideal: 500 },
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

function green(data) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i]; // Invert Red
    data[i + 1] = data[i + 1] + 60; // Invert Green
    data[i + 2] = data[i + 2]; // Invert Blue
  }
}

function drawWebcamContinuous() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const scannedData = scannedImage.data;
  const pixelationFactor = 5;
  green(scannedData);
  for (let y = 0; y < canvas.height; y += pixelationFactor) {
    for (let x = 0; x < canvas.width; x += pixelationFactor) {
      // extracting the position of the sample pixel
      const pixelIndexPosition = (x + y * canvas.width) * 4;
      // drawing a square replacing the current pixels
      ctx.fillStyle = `rgba(
        ${scannedData[pixelIndexPosition]},
        ${scannedData[pixelIndexPosition + 1]},
        ${scannedData[pixelIndexPosition + 2]},
        ${scannedData[pixelIndexPosition + 3]}
        )`;
      ctx.fillRect(x, y, pixelationFactor, pixelationFactor);
    }
  }
  // for (let i = 0; i < scannedData.length; i += 4) {
  //   console.log(scannedData[i]);
  // }
  requestAnimationFrame(drawWebcamContinuous);
}

let canvas;
let ctx;

async function main() {
  await setupCamera();
  video.play();

  canvas = document.getElementById("facecanvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx = canvas.getContext("2d");

  drawWebcamContinuous();

  console.log("CAMARA WORKING");
}

document.addEventListener("DOMContentLoaded", main);
