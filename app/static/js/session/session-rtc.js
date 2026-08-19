import { getSocket } from "../utils/socket.js";
import { initLocalVideo } from "./session-main.js";

const socket = getSocket();

// WebRTC stream connetion
const peerConnection = new RTCPeerConnection();

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.send(
      JSON.stringify({
        type: "candidate",
        candidate: event.candidate,
      }),
    );
  }
};

export async function establishRTCOffer() {
  if (peerConnection) {
    const localStream = await initLocalVideo();
    const tracks = localStream.getTracks();

    tracks.forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Initiator: Creates an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.send(
      JSON.stringify({
        type: "offer",
        offer: offer,
      }),
    );
  }
}

export async function handleOffer(offer) {
  if (peerConnection) {
    const localStream = await initLocalVideo();
    const tracks = localStream.getTracks();

    tracks.forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.send(
      JSON.stringify({
        type: "answer",
        answer: answer,
      }),
    );
  }
}

export async function handleAnswer(answer) {
  if (peerConnection) {
    await peerConnection.setRemoteDescription(answer);
  }
}

export async function handleCandidate(candidate) {
  const data = candidate;

  await peerConnection.addIceCandidate(data);
}
