package com.altasoft.exchange.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageJson {
    private String message;
    private String authorUserName;
    private String recipientUserName;

    @Override
    public String toString() {
        return "MessageJson{" +
                "message='" + message + '\'' +
                ", authorUserName='" + authorUserName + '\'' +
                ", recipientUserName='" + recipientUserName + '\'' +
                '}';
    }
}
