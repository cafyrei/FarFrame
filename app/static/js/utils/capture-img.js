import { initiateCaptureSequence } from "../session/session-socket.js";

const canvas = document.getElementById("videoCanvas");
const captureBtn = document.getElementById("captureBtn");
const countdownContainer = document.getElementById("countdown-container");
const countdownElement = document.getElementById("countdown");
const pizzaSvg = document.getElementById("countdown-pizza");

// SLICES ARE USED FOR THE COUNTDOWN VISUALIZATION
const TOTAL_SLICES = 6;
let slices = [];

// THIS IS USED TO LIMIT THE NUMBER OF IMAGES CAPTURED
const TOTAL_SHOTS = 4;
const previewImages = [
  document.getElementById("shot-0"),
  document.getElementById("shot-1"),
  document.getElementById("shot-2"),
  document.getElementById("shot-3"),
];

const previewLabels = [
  document.getElementById("label-0"),
  document.getElementById("label-1"),
  document.getElementById("label-2"),
  document.getElementById("label-3"),
];

function getOrderedVideos() {
  const videos = Array.from(
    document.getElementById("video-grid").querySelectorAll("video"),
  );

  return videos.sort((a, b) => Number(a.style.order) - Number(b.style.order));
}

function drawVideo(context, video, x, videoWidth, canvasHeight) {
  const isMirrored = video.style.transform === "scaleX(-1)";

  const vWidth = video.videoWidth || 640;
  const vHeight = video.videoHeight || 480;

  const destinationRatio = videoWidth / canvasHeight;

  const sourceHeight = vHeight;
  const sourceWidth = sourceHeight * destinationRatio;

  const sourceX = (vWidth - sourceWidth) / 2;
  const sourceY = 0;

  // Save Initial Canvas
  context.save();


  // Start the Tweaks Happen (mirroring and filters)
  if (isMirrored) {
    context.translate(x + videoWidth, 0);
    context.scale(-1, 1);
  } else {
    context.translate(x, 0);
  }

  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    videoWidth,
    canvasHeight,
  );

  context.restore();
}

function showCaptureVideo(imageDataUrl) {
  const nextPreview = previewImages.find((img) =>
    img.classList.contains("hidden")
  );

  if (!nextPreview) {
    console.warn("All preview slots are filled.");
    return;
  }

  nextPreview.src = imageDataUrl;
  nextPreview.classList.remove("hidden");

  const previewIndex = previewImages.indexOf(nextPreview);

  if (previewLabels[previewIndex]) {
    previewLabels[previewIndex].classList.add("hidden");
  }
}

function captureImage() {
  const videos = getOrderedVideos();

  const videoCount = videos.length;

  if (videoCount === 0) {
    console.warn("No video elements found in the video grid.");
    return;
  }

  const context = canvas.getContext("2d");

  canvas.width = 1920;
  canvas.height = 1080;

  context.filter = document.getElementById("video-grid").style.filter || "none";

  const videoWidth = canvas.width / videoCount;

  videos.forEach((video, index) => {
    const x = index * videoWidth;

    drawVideo(context, video, x, videoWidth, canvas.height);
  });

  const imageDataUrl = canvas.toDataURL("image/png");

  showCaptureVideo(imageDataUrl);
}

export function resetCaptureSession() {
  imageTakenCount = 0;

  previewImages.forEach((image, index) => {
    image.src = "";
    image.classList.add("hidden");

    previewLabels[index].classList.remove("hidden");
  });
  
  resetPizza();
} 


// ==================================================
// SVG Pizza
// ==================================================

function getPointOnCircle(angle, radius, centerX, centerY) {
  // -90 makes the pizza start from the top
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

function createSlicePath(startAngle, endAngle) {
  const centerX = 50;
  const centerY = 50;
  const radius = 45;

  const start = getPointOnCircle(startAngle, radius, centerX, centerY);

  const end = getPointOnCircle(endAngle, radius, centerX, centerY);

  return `
    M ${centerX} ${centerY}
    L ${start.x} ${start.y}
    A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}
    Z
  `;
}

function createPizzaSlices() {
  pizzaSvg.replaceChildren();
  slices = [];

  const anglePerSlice = 360 / TOTAL_SLICES;

  for (let i = 0; i < TOTAL_SLICES; i++) {
    const startAngle = i * anglePerSlice;
    const endAngle = startAngle + anglePerSlice;

    const slice = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    slice.setAttribute("d", createSlicePath(startAngle, endAngle));

    slice.setAttribute("fill", "white");
    slice.setAttribute("stroke-width", "1");

    slice.style.transition = "opacity 200ms ease";

    pizzaSvg.appendChild(slice);
    slices.push(slice);
  }
}

function resetPizza() {
  slices.forEach((slice) => {
    slice.style.opacity = ".5";
  });
}

// ==================================================
// Countdown
// ==================================================

let imageTakenCount = 0;

export function startCountdown() {
  captureBtn.classList.add("hidden");

  let countdownValue = TOTAL_SLICES;

  resetPizza();

  countdownElement.textContent = countdownValue;
  countdownContainer.classList.remove("hidden");

  const countdownInterval = setInterval(() => {
    countdownValue--;

    const sliceIndex = countdownValue;

    if (slices[sliceIndex]) {
      slices[sliceIndex].style.opacity = "0";
    }

    countdownElement.textContent = countdownValue;

    if (countdownValue <= 0) {
      clearInterval(countdownInterval);

      countdownContainer.classList.add("hidden");

      imageTakenCount++;
      captureImage();

      if (imageTakenCount < TOTAL_SHOTS) {
        setTimeout(() => {
          startCountdown();
        }, 1500);
      } else {
        captureBtn.classList.remove("hidden");
        imageTakenCount = 0;
      }
    }
  }, 1000);
}

// ==================================================
// Initialization
// ==================================================

createPizzaSlices();

captureBtn.addEventListener("click", () => {
  initiateCaptureSequence();
});
