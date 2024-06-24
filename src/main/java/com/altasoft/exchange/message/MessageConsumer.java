package com.altasoft.exchange.message;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.channel.ChannelRepository;
import com.altasoft.exchange.notification.NotificationService;
import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MessageConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageConsumer.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @Autowired
    public MessageConsumer(MessageRepository messageRepository, UserRepository userRepository, ChannelRepository channelRepository, NotificationService notificationService, ObjectMapper objectMapper) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topicPattern = ".*")
    public void listen(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) throws JsonProcessingException {
        LOGGER.info("Received message: {}", record.value());
        MessageJson messageJson = objectMapper.readValue(record.value(), MessageJson.class);
        processMessage(messageJson);
        acknowledgment.acknowledge();
    }

    public void processMessage(MessageJson messageJson) {
        if (messageRepository.existsById(messageJson.getId())) {
            LOGGER.info("Message with id {} already exists. Skipping processing.", messageJson.getId());
            return;
        }

        User author = userRepository.findByUserName(messageJson.getAuthorUserName())
                .orElseThrow(() -> new RuntimeException("Author user not found: " + messageJson.getAuthorUserName()));

        Channel channel = channelRepository.findById(messageJson.getChannelId())
                .orElseThrow(() -> new RuntimeException("Channel not found: " + messageJson.getChannelId()));

        Message message = new Message();
        message.setId(messageJson.getId());
        message.setAuthor(author);
        message.setContent(messageJson.getMessage());
        message.setTimestamp(LocalDateTime.now());
        message.setChannel(channel);
        messageRepository.save(message);

        sendNotificationToSubscribers(channel, messageJson);
    }

    private void sendNotificationToSubscribers(Channel channel, MessageJson messageJson) {
        for (Subscription subscription : channel.getSubscribers()) {
            notificationService.sendNotification(subscription.getUser().getUserName(), messageJson);
        }

        if (channel.getParent() != null) {
            sendNotificationToSubscribers(channel.getParent(), messageJson);
        }
    }
}







