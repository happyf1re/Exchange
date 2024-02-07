package com.altasoft.exchange.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class MessageProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageProducer.class);


    private KafkaTemplate<String, String> kafkaTemplate;

    public MessageProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, String messageContent, String authorUserName, String recipientUserName) {
        LOGGER.info("=======================Сообщение отправляется в кафку===========================");
        Message<String> message = MessageBuilder
                .withPayload(messageContent)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .setHeader("authorUserName", authorUserName.getBytes(StandardCharsets.UTF_8))
                .setHeader("recipientUserName", recipientUserName.getBytes(StandardCharsets.UTF_8))
                .build();
        kafkaTemplate.send(message);
        LOGGER.info("=======================Сообщение отправлено в кафку===========================");
    }
}
