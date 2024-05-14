//package com.altasoft.exchange.stringmessage;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class StringMessageProducer {
//
//    private static final Logger LOGGER = LoggerFactory.getLogger(StringMessageProducer.class);
//    private final KafkaTemplate<String, String> kafkaTemplate;
//
//    public StringMessageProducer(KafkaTemplate<String, String> kafkaTemplate) {
//        this.kafkaTemplate = kafkaTemplate;
//    }
//
//    public void sendMessage(String topic, String message) {
//        try {
//            LOGGER.info("Отправляем сообщение в кафку: {}", message);
//            kafkaTemplate.send(topic, message);
//            LOGGER.info("Отправлено в топик: {}", topic);
//        } catch (Exception e) {
//            LOGGER.error("Поймали исключение");
//        }
//
//    }
//}
