package com.altasoft.exchange.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageProducer.class);
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper; // Добавляем ObjectMapper

    public MessageProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper; // Инициализируем ObjectMapper
    }

    public void sendMessage(String topic, MessageJson messageContent) {

            try {
                // Сериализация объекта MessageJson в строку JSON
                String jsonMessage = objectMapper.writeValueAsString(messageContent);
                // Логирование отправки сообщения
                LOGGER.info("Сообщение отправляется в кафку: {}", jsonMessage);
                // Отправка сериализованного сообщения в указанный топик
                kafkaTemplate.send(topic, jsonMessage);
                LOGGER.info("Сообщение успешно отправлено в топик: {}", topic);
            } catch (JsonProcessingException e) {
                LOGGER.error("Ошибка при сериализации сообщения в JSON: {}", e.getMessage());
            }

    }
}
