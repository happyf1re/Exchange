package com.altasoft.exchange.stringmessage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class StringMessageConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(StringMessageConsumer.class);

    private final StringMessageRepository stringMessageRepository;
    private final StringMessageProducer stringMessageProducer;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public StringMessageConsumer(StringMessageRepository stringMessageRepository, StringMessageProducer stringMessageProducer, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.stringMessageRepository = stringMessageRepository;
        this.stringMessageProducer = stringMessageProducer;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "main-topic")
    public void listenToMainTopic(String message) throws JsonProcessingException {
        LOGGER.info("------------------------Вошли в метод listenToMainTopic---------------------------");
        LOGGER.info("Сообщение ----------------- {}", message);

        //парсим строку
        JsonNode jsonNode = objectMapper.readTree(message);
        //извлекаем имя получателя
        String recipientName = jsonNode.get("recipientName").asText();
        //извлекаем сообщение
        String content = jsonNode.get("message").asText();
        //перенаправляем
        stringMessageProducer.sendMessage(recipientName + "-topic", content);

        StringMessage newMessage = new StringMessage();
        newMessage.setContent(message);
        stringMessageRepository.save(newMessage);
    }

}
