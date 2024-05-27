package com.altasoft.exchange.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class MessageProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageProducer.class);
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public MessageProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendMessage(String topic, MessageJson messageContent) {
        try {
            // Сериализация объекта MessageJson в строку JSON
            String jsonMessage = objectMapper.writeValueAsString(messageContent);

            // Логирование сериализованного сообщения
            LOGGER.info("Serialized message: {}", jsonMessage);

            // Отправка сообщения в Kafka
            Message<String> message = MessageBuilder.withPayload(jsonMessage)
                    .setHeader(KafkaHeaders.TOPIC, topic)
                    .build();
            kafkaTemplate.send(message);
            LOGGER.info("Message sent to Kafka topic: {}", topic);
        } catch (JsonProcessingException e) {
            LOGGER.error("Error serializing message to JSON: {}", e.getMessage());
        }
    }
}
