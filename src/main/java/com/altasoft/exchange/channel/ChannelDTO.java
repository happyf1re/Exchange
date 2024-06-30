package com.altasoft.exchange.channel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChannelDTO {
    private Integer id;
    private String name;
    private String creatorUserName;
    private boolean isPrivate;
    private Integer parentId;
}

