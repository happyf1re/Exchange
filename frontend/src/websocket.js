import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let isConnected = false;
let shouldReconnect = true;
let isConnecting = false; // добавлено для предотвращения множественных подключений

export const connectWebSocket = (userName, onMessageReceived) => {
    return new Promise((resolve, reject) => {
        if (isConnected || isConnecting) {
            resolve(stompClient);
            return;
        }

        isConnecting = true;
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(() => socket);

        stompClient.onConnect = (frame) => {
            isConnected = true;
            isConnecting = false;
            resolve(stompClient);
        };

        stompClient.onStompError = (frame) => {
            isConnected = false;
            isConnecting = false;
            reject(frame);
        };

        stompClient.onWebSocketClose = (event) => {
            isConnected = false;
            isConnecting = false;
            if (shouldReconnect && event.code !== 1000) {
                setTimeout(() => connectWebSocket(userName, onMessageReceived).then(resolve).catch(reject), 5000);
            } else {
                stompClient.deactivate();
            }
        };

        stompClient.activate();
    });
};

export const subscribeToChannel = (channelName, onMessageReceived) => {
    if (isWebSocketConnected()) {
        stompClient.subscribe(`/topic/channel.${channelName}`, (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    }
};

export const subscribeToInvitations = (userName, onMessageReceived) => {
    if (isWebSocketConnected()) {
        stompClient.subscribe(`/user/${userName}/queue/invitations`, (message) => {
            onMessageReceived(message.body);
        });
    }
};

export const isWebSocketConnected = () => {
    return isConnected;
};

export const disconnectWebSocket = () => {
    shouldReconnect = false;
    if (stompClient) {
        stompClient.deactivate();
        isConnected = false;
    }
};
