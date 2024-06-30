package com.altasoft.exchange.invitation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvitationDTO {
    private Integer id;
    private Integer channelId;
    private String inviterUserName;
    private String inviteeUserName;
    private LocalDateTime timestamp;
}
