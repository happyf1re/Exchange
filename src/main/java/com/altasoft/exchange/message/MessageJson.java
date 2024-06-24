package com.altasoft.exchange.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageJson {
    @JsonProperty("message")
    private String message;
    @JsonProperty("authorUserName")
    private String authorUserName;
    @JsonProperty("channelId")
    private Integer channelId;

    @Override
    public String toString() {
        return "MessageJson{" +
                "message='" + message + '\'' +
                ", authorUserName='" + authorUserName + '\'' +
                ", channelId=" + channelId +
                '}';
    }
}

