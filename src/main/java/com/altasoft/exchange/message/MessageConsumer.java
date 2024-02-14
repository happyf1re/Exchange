package com.altasoft.exchange.message;

import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import jakarta.transaction.Transactional;
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

    @Autowired
    public MessageConsumer(MessageRepository messageRepository, UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "main-topic", groupId = "group-id")
    @Transactional
    public void listenToMainTopic(ConsumerRecord<String, MessageJson> record) {
        LOGGER.info("Вошли в метод слушателя");

        MessageJson messageJson = record.value();

        // Извлекаем и логируем необходимые данные
        LOGGER.info("Содержимое сообщения: message ----> {}, authorUserName ----> {}, recipientUserName ----> {}",
                messageJson.getMessage(), messageJson.getAuthorUserName(), messageJson.getRecipientUserName());

        // Извлечение имени пользователя-получателя и автора из хедера сообщения
        String recipientUserName = messageJson.getRecipientUserName();
        String authorUserName = messageJson.getAuthorUserName();

        // Выводим полную информацию о сообщении в лог
        LOGGER.info("Получено сообщение: authorName ----> {}, recipientName -----> {}, message -----> {}",
                authorUserName, recipientUserName, messageJson.getMessage());

        User recipient = userRepository.findByUserName(recipientUserName)
                .orElseThrow(() -> new RuntimeException("Recipient user not found: " + recipientUserName));

        User author = userRepository.findByUserName(authorUserName)
                .orElseThrow(() -> new RuntimeException("Author user not found: " + authorUserName));

        Message message = new Message();
        message.setAuthor(author);
        message.setRecipient(recipient);
        message.setContent(messageJson.getMessage());
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        String targetTopic = recipientUserName + "-topic";
        try {
            kafkaTemplate.send(targetTopic, record.value().toString());
            LOGGER.info("Message sent to topic: {}", targetTopic);
        } catch (KafkaException e) {
            LOGGER.error("Failed to send message to topic: {}. Error: {}", targetTopic, e.getMessage());
        }
    }
}
