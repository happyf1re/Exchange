package com.altasoft.exchange.stringmessage;

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
public class StringMessageController {
    private final StringMessageProducer stringMessageProducer;

    public StringMessageController(StringMessageProducer stringMessageProducer) {
        this.stringMessageProducer = stringMessageProducer;
    }

    @PostMapping("/send-message")
    public String sendMessage(@RequestBody SendMessageRequest request) {
        StringMessage stringMessage = new StringMessage();
        stringMessage.setContent(request.getMessage());
        stringMessageProducer.sendMessage("main-topic", stringMessage.getContent());
        return "Сообщение отправлено";

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SendMessageRequest {
        private String message;
    }
}
