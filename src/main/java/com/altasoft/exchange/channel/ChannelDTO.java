package com.altasoft.exchange.channel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChannelDTO {
    private Integer id;
    private String name;
    private String creatorUserName;

    @JsonProperty("isPrivate")
    private boolean isPrivate;

    @JsonProperty("isSubscribed")
    private boolean isSubscribed; // Новое поле

    private Integer parentId;
}

