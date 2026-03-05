import { io } from 'socket.io-client';
import { BASE_URL } from './api';

// Singleton socket instance — shared across all screens
const socket = io(BASE_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
