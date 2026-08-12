const test_button = document.getElementById("test-socket");

const room_code = new URLSearchParams(window.location.search).get("room_code");

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(
  `${protocol}//${window.location.host}/ws/${room_code}`,
);

socket.onopen = () => {
  console.log("Websocket connected to room", room_code);
};

test_button.addEventListener("click", () => {
  socket.send(
    JSON.stringify({
      type: "test",
      message: "Hello!",
    }),
  );
});

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  console.log("Received:", data);
};
