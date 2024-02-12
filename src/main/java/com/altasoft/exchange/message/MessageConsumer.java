package com.altasoft.exchange.message;

import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
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

    @KafkaListener(topics = "main-topic")
    @Transactional
    public void listenToMainTopic(ConsumerRecord<String, String> record) {
        LOGGER.info("Вошли в метод слушателя");

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(record.value());

            // Извлекаем и логируем необходимые данные
            String message = rootNode.path("message").asText();
            String authorUserName = rootNode.path("authorUserName").asText();
            String recipientUserName = rootNode.path("recipientUserName").asText();
            LOGGER.info("Содержимое сообщения: message ----> {}, authorUserName ----> {}, recipientUserName ----> {}",
                    message, authorUserName, recipientUserName);
        } catch (Exception e) {
            LOGGER.error("Ошибка при обработке JSON сообщения: {}", e.getMessage());
        }


        // Извлечение имени пользователя-получателя и автора из хедера сообщения
        String recipientUserName = new String(record.headers().lastHeader("recipientUserName").value(), StandardCharsets.UTF_8);
        String authorUserName = new String(record.headers().lastHeader("authorUserName").value(), StandardCharsets.UTF_8);

        // Выводим полную информацию о сообщении в лог
        LOGGER.info("Получено сообщение: authorName ----> {}, recipientName -----> {}, message -----> {}",
                authorUserName, recipientUserName, record.value());



        User recipient = userRepository.findByUserName(recipientUserName)
                .orElseThrow(() -> new RuntimeException("Recipient user not found: " + recipientUserName));

        // Поиск пользователя-автора в базе данных
        User author = userRepository.findByUserName(authorUserName)
                .orElseThrow(() -> new RuntimeException("Author user not found: " + authorUserName));

        // Создание и сохранение сообщения в базе данных
        Message message = new Message();
        message.setAuthor(author);
        message.setRecipient(recipient);
        message.setContent(record.value());
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        // Отправка сообщения в топик, соответствующий пользователю-получателю
        String targetTopic = recipientUserName + "-topic";
        try {
            kafkaTemplate.send(targetTopic, record.value());
            LOGGER.info("Message sent to topic: {}", targetTopic);
        } catch (KafkaException e) {
            LOGGER.error("Failed to send message to topic: {}. Error: {}", targetTopic, e.getMessage());
            // Здесь можно добавить дополнительную логику обработки ошибки, например, повторную отправку или уведомление администратора
        }
    }
}
