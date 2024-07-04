import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (userName, onMessageReceived) => {
    if (stompClient && stompClient.connected) {
        return stompClient;
    }

    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe(`/topic/user.${userName}`, (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });

    return stompClient;
};

export const subscribeToChannel = (channelName, onMessageReceived) => {
    if (stompClient && stompClient.connected) {
        stompClient.subscribe(`/topic/channel.${channelName}`, (message) => {
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
        });
        stompClient = null;
    }
};
