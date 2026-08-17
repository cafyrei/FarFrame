import { getSocket, buildRoomUrl } from "../utils/socket.js";

const socket = getSocket();

if (socket) {
  socket.onopen = () => {
    console.log("Connected");
  };

  socket.onclose = (event) => {
    console.log("Socket closed:", event.code);
  };

  
}
