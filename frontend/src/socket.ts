import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: false,
});

const CONNECT_DURATION_MS = 5 * 60 * 1000;
const RECONNECT_DELAY_MS = 5 * 1000;

let cycleEnabled = false;
let disconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const clearTimers = () => {
  if (disconnectTimer) clearTimeout(disconnectTimer);
  if (reconnectTimer) clearTimeout(reconnectTimer);
  disconnectTimer = null;
  reconnectTimer = null;
};

const scheduleDisconnect = () => {
  clearTimers();
  disconnectTimer = setTimeout(() => {
    if (!cycleEnabled) return;
    if (socket.connected) socket.disconnect();

    reconnectTimer = setTimeout(() => {
      if (!cycleEnabled) return;
      if (!socket.connected) socket.connect();
      scheduleDisconnect();
    }, RECONNECT_DELAY_MS);
  }, CONNECT_DURATION_MS);
};

export const startSocketCycle = () => {
  cycleEnabled = true;
  if (!socket.connected) socket.connect();
  scheduleDisconnect();
};

export const stopSocketCycle = (disconnectNow = true) => {
  cycleEnabled = false;
  clearTimers();
  if (disconnectNow && socket.connected) socket.disconnect();
};
