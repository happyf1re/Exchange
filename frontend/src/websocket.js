import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let isConnected = false;
let shouldReconnect = true;

export const connectWebSocket = (userName, onMessageReceived) => {
    return new Promise((resolve, reject) => {
        if (stompClient && isConnected) {
            resolve(stompClient);
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(() => socket);

        stompClient.reconnect_delay = 0; // Отключаем автоматическое переподключение

        stompClient.onConnect = (frame) => {
            console.log('Подключен: ' + frame);
            isConnected = true;
            resolve(stompClient);
        };

        stompClient.onStompError = (frame) => {
            console.error('Ошибка брокера: ' + frame.headers['message']);
            console.error('Дополнительные детали: ' + frame.body);
            isConnected = false;
            reject(frame);
        };

        stompClient.onWebSocketClose = (event) => {
            console.log('WebSocket закрыт: ', event);
            isConnected = false;
            if (shouldReconnect && event.code !== 1000) {
                // Переподключаемся только при ненормальном закрытии
                setTimeout(() => {
                    connectWebSocket(userName, onMessageReceived)
                        .then(resolve)
                        .catch(reject);
                }, 5000);
            } else {
                if (stompClient !== null) {
                    stompClient.deactivate();
                }
            }
        };

        stompClient.activate();
    });
};

export const isWebSocketConnected = () => {
    return stompClient && isConnected;
};

export const subscribeToChannel = (channelName, onMessageReceived) => {
    if (isWebSocketConnected()) {
        stompClient.subscribe(`/topic/channel.${channelName}`, (message) => {
            onMessageReceived(JSON.parse(message.body));
        });
    } else {
        console.error('Невозможно подписаться на канал. Нет STOMP соединения.');
    }
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        shouldReconnect = false; // Отключаем флаг переподключения
        stompClient.deactivate(() => {
            console.log("Отключен");
            isConnected = false;
        });
        stompClient = null;
    }
};
