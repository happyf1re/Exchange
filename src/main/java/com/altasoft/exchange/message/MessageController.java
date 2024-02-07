package com.altasoft.exchange.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/kafka")
public class MessageController {

    private final MessageProducer messageProducer;

    public MessageController(MessageProducer messageProducer) {
        this.messageProducer = messageProducer;
    }

    @PostMapping("/send-message")
    public String sendMessage(@RequestBody SendMessageRequest request) {
        messageProducer.sendMessage("main-topic", request.getMessage(), request.getAuthorUserName(), request.getRecipientUserName());
        return "Message sent";
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
