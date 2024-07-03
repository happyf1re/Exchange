import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (userName, onMessageReceived) => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/topic/${userName}`, (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });

    return stompClient;
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect(() => {
            console.log("Disconnected");
        });
    }
};
