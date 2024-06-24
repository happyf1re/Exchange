package com.altasoft.exchange.message;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.channel.ChannelRepository;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageProducer messageProducer;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;

    public MessageController(MessageProducer messageProducer,
                             MessageRepository messageRepository,
                             UserRepository userRepository,
                             ChannelRepository channelRepository) {
        this.messageProducer = messageProducer;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody SendMessageRequest request) {
        Channel channel = channelRepository.findById(request.getChannelId())
                .orElseThrow(() -> new RuntimeException("Channel not found: " + request.getChannelId()));
        User author = userRepository.findByUserName(request.getAuthorUserName())
                .orElseThrow(() -> new RuntimeException("Author user not found: " + request.getAuthorUserName()));

        // Создание нового сообщения
        Message newMessage = new Message();
        newMessage.setAuthor(author);
        newMessage.setChannel(channel);
        newMessage.setContent(request.getMessage());
        newMessage.setTimestamp(LocalDateTime.now());
        newMessage = messageRepository.save(newMessage); // Сохранение и получение ID

        // Создание MessageJson с установленным ID
        MessageJson messageJson = new MessageJson();
        messageJson.setId(newMessage.getId());
        messageJson.setMessage(request.getMessage());
        messageJson.setAuthorUserName(request.getAuthorUserName());
        messageJson.setChannelId(request.getChannelId());

        messageProducer.sendMessage(channel.getName(), messageJson);
        return ResponseEntity.ok("Message sent");
    }

    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<Message>> getMessagesByChannel(@PathVariable Integer channelId) {
        List<Message> messages = messageRepository.findByChannelId(channelId);
        return ResponseEntity.ok(messages);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SendMessageRequest {
        private String message;
        private String authorUserName;
        private Integer channelId;
    }
}











