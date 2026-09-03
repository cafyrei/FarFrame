const canvas = document.getElementById("videoCanvas");
const captureBtn = document.getElementById("captureBtn");

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

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  context.drawImage(
    videos[0],
    0,
    0,
    canvas.width,
    canvas.height
  );

  console.log("Image captured and drawn on canvas.");
}

captureBtn.addEventListener("click", () => {
  console.log("Attempted to capture image.");
  captureImage();
});