package com.altasoft.exchange.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Integer id;
    private String content;
    private String authorUserName;
    private Integer channelId;
    private String channelName; // добавляем название канала
    private LocalDateTime timestamp;
}
