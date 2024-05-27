package com.altasoft.exchange.message;

import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MessageConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageConsumer.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper;

    @Autowired
    public MessageConsumer(MessageRepository messageRepository, UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "main-topic")
    public void listen(ConsumerRecord<String, String> record) throws JsonProcessingException {
        LOGGER.info("Received message in main-topic: {}", record.value());
        ObjectMapper mapper = new ObjectMapper();
        MessageJson messageJson = mapper.readValue(record.value(), MessageJson.class);
        processMessage(messageJson);
    }

    public void processMessage(MessageJson messageJson) {
        // Получение пользователей из БД и создание сообщения
        User recipient = userRepository.findByUserName(messageJson.getRecipientUserName())
                .orElseThrow(() -> new RuntimeException("Recipient user not found: " + messageJson.getRecipientUserName()));

        User author = userRepository.findByUserName(messageJson.getAuthorUserName())
                .orElseThrow(() -> new RuntimeException("Author user not found: " + messageJson.getAuthorUserName()));

        Message message = new Message();
        message.setAuthor(author);
        message.setRecipient(recipient);
        message.setContent(messageJson.getMessage());
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        // Логирование отправки сообщения в топик получателя
        String targetTopic = recipient.getUserName() + "-topic";
        try {
            kafkaTemplate.send(targetTopic, objectMapper.writeValueAsString(messageJson));
            LOGGER.info("Message sent to user-specific topic: {}", targetTopic);
        } catch (KafkaException | JsonProcessingException e) {
            LOGGER.error("Failed to send message to topic: {}. Error: {}", targetTopic, e.getMessage());
        }
    }
}
