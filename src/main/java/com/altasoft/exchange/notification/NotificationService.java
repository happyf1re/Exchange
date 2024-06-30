package com.altasoft.exchange.notification;

import com.altasoft.exchange.message.MessageJson;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendNotification(String userName, MessageJson messageJson) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage("New message in channel: " + messageJson.getChannelId());
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);

        try {
            String jsonMessage = objectMapper.writeValueAsString(messageJson);
            kafkaTemplate.send("notifications-topic", userName, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public List<Notification> getUnreadNotifications(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        return notificationRepository.findByUserAndIsReadFalse(user);
    }

    public Notification getNotificationById(Integer id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
    }

    public void save(Notification notification) {
        notificationRepository.save(notification);
    }
}


