const videoElement = document.getElementById("webcam");
const cameraBtn = document.getElementById("cameraBtn");
const muteBtn = document.getElementById("muteBtn");

let mediaStream = null

cameraBtn.addEventListener("click", () => {
    startMedia();

    console.log("start");
});


muteBtn.addEventListener("click", () => {
    stopMedia();
    console.log("end");
});


async function startMedia() {
    try {
        mediaStream =  await navigator.mediaDevices.getUserMedia(
            {
                video: {
                    width : { ideal: 1280 },
                    height : { ideal: 720 },
                    facingMode: "user"
                }
            }
        )
    } catch (error) {
        console.error('Error accessing media devices:', error);
        if (error.name === 'NotAllowedError') {
          alert('Permission denied. Please allow camera and microphone access.');
        } else if (error.name === 'NotFoundError') {
          alert('No webcam or microphone found on this device.');
        } else {
          alert(`Error: ${error.message}`);
        }
    }
}

function stopMedia() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());

        videoElement.srcObject = null

        cameraBtn.disabled = false;
        muteBtn.disabled = false;
    }
}