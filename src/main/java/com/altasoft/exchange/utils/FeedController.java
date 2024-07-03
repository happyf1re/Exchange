package com.altasoft.exchange.utils;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.channel.ChannelRepository;
import com.altasoft.exchange.message.Message;
import com.altasoft.exchange.message.MessageDTO;
import com.altasoft.exchange.message.MessageJson;
import com.altasoft.exchange.message.MessageRepository;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/feed")
public class FeedController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

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

    // Метод для подписки на обновления фида пользователя через WebSocket
    @MessageMapping("/feed/{userName}")
    @SendTo("/topic/user.{userName}")
    public String subscribeToFeed(@DestinationVariable String userName) {
        return "Subscribed to feed for user: " + userName;
    }

    // Метод для получения сообщений фида пользователя через REST API
    @GetMapping("/{userName}")
    public List<MessageDTO> getUserFeed(@PathVariable String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));

        List<Message> messages = messageRepository.findByAuthor(user);
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Метод для обработки сообщений из Kafka
    @KafkaListener(topics = "your-topic", groupId = "your-group-id")
    public void consume(String message) {
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            String userName = jsonNode.get("authorUserName").asText();

            // Сохранение сообщения в базу данных
            MessageJson messageJson = objectMapper.treeToValue(jsonNode, MessageJson.class);
            processMessage(messageJson);

            // Отправка сообщения через WebSocket
            messagingTemplate.convertAndSend("/topic/user." + userName, message);
        } catch (Exception e) {
            // Обработка ошибок
            e.printStackTrace();
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



