import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let isConnected = false;

export const connectWebSocket = (userName, onMessageReceived) => {
    return new Promise((resolve, reject) => {
        if (stompClient && isConnected) {
            resolve(stompClient);
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            isConnected = true;
            resolve(stompClient);
        }, (error) => {
            console.error('WebSocket connection error:', error);
            isConnected = false;
            reject(error);
        });
    });
};

export const subscribeToChannel = (channelName, onMessageReceived) => {
    if (stompClient && isConnected) {
        stompClient.subscribe(`/topic/${channelName}`, (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    } else {
        console.error('Cannot subscribe to channel. No STOMP connection.');
    }
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect(() => {
            console.log("Disconnected");
            isConnected = false;
        });
        stompClient = null;
    }
};
