package com.altasoft.exchange.message;

import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageProducer messageProducer;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(MessageProducer messageProducer, MessageRepository messageRepository, UserRepository userRepository) {
        this.messageProducer = messageProducer;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody SendMessageRequest request) {
        // Создаем объект MessageJson из данных запроса
        MessageJson messageJson = new MessageJson();
        messageJson.setMessage(request.getMessage());
        messageJson.setAuthorUserName(request.getAuthorUserName());
        messageJson.setRecipientUserName(request.getRecipientUserName());

        // Передаем объект MessageJson в MessageProducer
        messageProducer.sendMessage("main-topic", messageJson);
        return ResponseEntity.ok("Message sent");
    }

    @GetMapping("/received/{userName}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        List<Message> messages = messageRepository.findByRecipient(user);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/sent/{userName}")
    public ResponseEntity<List<Message>> getSentMessages(@PathVariable String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        List<Message> messages = messageRepository.findByAuthor(user);
        return ResponseEntity.ok(messages);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SendMessageRequest {
        private String message;
        private String authorUserName;
        private String recipientUserName;
    }
}
