const canvas = document.getElementById("videoCanvas");
const captureBtn = document.getElementById("captureBtn");
const countdownContainer = document.getElementById("countdown-container");
const countdownElement = document.getElementById("countdown");
const pizzaSvg = document.getElementById("countdown-pizza");

const TOTAL_SLICES = 10;

let slices = [];

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

function captureImage() {
  const videos = document
    .getElementById("video-grid")
    .querySelectorAll("video");

  if (videos.length === 0) {
    console.warn("No video elements found in the video grid.");
    return;
  }

  console.log("Video elements found:", videos.length);

  const context = canvas.getContext("2d");

  canvas.width = 1100;
  canvas.height = 600;

  context.drawImage(videos[0], 0, 0, canvas.width, canvas.height);

  const imageDataUrl = canvas.toDataURL("image/png");

  const nextPreview = previewImages.find((img) =>
    img.classList.contains("hidden"),
  );

  if (nextPreview) {
    nextPreview.src = imageDataUrl;
    nextPreview.classList.remove("hidden");
    previewLabels[previewImages.indexOf(nextPreview)].classList.add("hidden");
  } else {
    console.warn("All preview slots are filled. Cannot display more images.");
  }

  console.log("Image captured and drawn on canvas.");
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

function startCountdown() {
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

      captureImage();
    }
  }, 1000);
}

// ==================================================
// Initialization
// ==================================================

createPizzaSlices();

captureBtn.addEventListener("click", () => {
  captureBtn.classList.add("hidden");
  
  startCountdown();
});
