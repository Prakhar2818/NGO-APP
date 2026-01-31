import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to socket server");
  console.log("Socket ID:", socket.id);
});

socket.on("new-donation", (data) => {
  console.log("NEW DONATION RECEIVED:");
  console.log(JSON.stringify(data, null, 2));
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
