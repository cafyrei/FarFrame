import { getLocalMediaStream } from "./camera.js";

export function setMicrophoneEnabled(enabled) {
   const stream = getLocalMediaStream();

  if (!stream) {
    console.warn("Audio Stream not available.");
    return;
  }

  const audioTracks = stream.getAudioTracks();

  if (audioTracks.length === 0) {
    console.warn("No audio interface is currently attached to this device.");
    return;
  }

  audioTracks.forEach((track) => {
    track.enabled = enabled;
  });
}