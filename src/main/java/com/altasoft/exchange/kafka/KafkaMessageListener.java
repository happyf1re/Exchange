package com.altasoft.exchange.kafka;


import com.altasoft.exchange.message.MessageJson;
import com.altasoft.exchange.notification.NotificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
public class KafkaMessageListener {

    private final NotificationService notificationService;
    private final SimpMessagingTemplate template; // Для отправки сообщений через WebSocket
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaMessageListener(NotificationService notificationService, SimpMessagingTemplate template, ObjectMapper objectMapper) {
        this.notificationService = notificationService;
        this.template = template;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "notifications-topic", groupId = "notifications-group")
    public void listenNotifications(ConsumerRecord<String, String> record) throws JsonProcessingException {
        String userName = record.key();
        String jsonMessage = record.value();

        MessageJson messageJson = objectMapper.readValue(jsonMessage, MessageJson.class);

        // Обрабатываем уведомление для конкретного пользователя
        notificationService.sendNotification(userName, messageJson);

        // Отправляем сообщение через WebSocket
        template.convertAndSend("/topic/" + userName, messageJson);
    }
}


