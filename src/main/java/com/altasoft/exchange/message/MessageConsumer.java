package com.altasoft.exchange.message;

import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageConsumer.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper;

    public MessageConsumer(MessageRepository messageRepository, UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "main-topic", groupId = "group-id")
    @Transactional
    public void listenToMainTopic(String messageJsonStr) {
        LOGGER.info("Вошли в метод слушателя");


        try {
            MessageJson messageJson = objectMapper.readValue(messageJsonStr, MessageJson.class);
            // Логика определения целевого топика на основе имени получателя
            String targetTopic = messageJson.getRecipientUserName() + "-topic";
            kafkaTemplate.send(targetTopic, messageJsonStr);
        } catch (Exception e) {
            // Обработка ошибок
        }


    }
}
