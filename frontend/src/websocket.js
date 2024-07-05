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
        stompClient = Stomp.over(() => socket);

        stompClient.reconnect_delay = 5000; // Добавляем задержку перед повторным подключением

        stompClient.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            isConnected = true;
            resolve(stompClient);
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            isConnected = false;
            reject(frame);
        };

        stompClient.onWebSocketClose = (event) => {
            console.log('WebSocket closed: ' + event);
            isConnected = false;
        };

        stompClient.activate();
    });
};

export const subscribeToChannel = (channelName, onMessageReceived) => {
    if (stompClient && isConnected) {
        stompClient.subscribe(`/topic/channel.${channelName}`, (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    } else {
        console.error('Cannot subscribe to channel. No STOMP connection.');
    }
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.deactivate(() => {
            console.log("Disconnected");
            isConnected = false;
        });
        stompClient = null;
    }
};
