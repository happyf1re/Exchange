package com.altasoft.exchange.utils;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.channel.ChannelRepository;
import com.altasoft.exchange.message.Message;
import com.altasoft.exchange.message.MessageDTO;
import com.altasoft.exchange.message.MessageJson;
import com.altasoft.exchange.message.MessageRepository;
import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Controller
@RestController
@RequestMapping("/api/v1/feed")
public class FeedController {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public FeedController(SimpMessagingTemplate messagingTemplate, MessageRepository messageRepository, ChannelRepository channelRepository, UserRepository userRepository, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    // Метод для подписки на обновления канала через WebSocket
    @MessageMapping("/feed/{channelName}")
    @SendTo("/topic/channel.{channelName}")
    public String subscribeToChannelFeed(@DestinationVariable String channelName) {
        return "Subscribed to feed for channel: " + channelName;
    }

    // Метод для получения всех сообщений из каналов, на которые подписан пользователь, через REST API
    @GetMapping("/{userName}")
    public List<MessageDTO> getUserFeed(@PathVariable String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        List<Channel> subscribedChannels = user.getSubscriptions().stream()
                .map(Subscription::getChannel)
                .collect(Collectors.toList());

        List<Message> messages = messageRepository.findByChannelIn(subscribedChannels);
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Метод для обработки сообщений из Kafka
    @KafkaListener(topicPattern = ".*", groupId = "#{T(java.util.UUID).randomUUID().toString()}")
    public void consume(@Payload String message) {
        try {
            LOGGER.info("Received message: {}", message);
            JsonNode jsonNode = objectMapper.readTree(message);

            if (jsonNode.has("authorUserName") && jsonNode.has("message") && jsonNode.has("channelId")) {
                int channelId = jsonNode.get("channelId").asInt();
                Channel channel = channelRepository.findById(channelId)
                        .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));
                String channelName = channel.getName();

                // Сохранение сообщения в базу данных
                MessageJson messageJson = objectMapper.treeToValue(jsonNode, MessageJson.class);
                processMessage(messageJson);

                // Отправка сообщения через WebSocket
                messagingTemplate.convertAndSend("/topic/channel." + channelName, message);
            } else {
                LOGGER.error("Invalid message format: {}", message);
                throw new RuntimeException("Invalid message format");
            }
        } catch (Exception e) {
            // Обработка ошибок
            LOGGER.error("Error processing message: ", e);
        }
    }

    private void processMessage(MessageJson messageJson) {
        if (messageRepository.existsById(messageJson.getId())) {
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
    }

    // Метод для конвертации Message в MessageDTO
    private MessageDTO convertToDto(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(message.getId());
        messageDTO.setContent(message.getContent());
        messageDTO.setAuthorUserName(message.getAuthor().getUserName());
        messageDTO.setChannelId(message.getChannel().getId());
        messageDTO.setChannelName(message.getChannel().getName()); // Добавляем название канала
        messageDTO.setTimestamp(message.getTimestamp());
        return messageDTO;
    }
}




