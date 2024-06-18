package com.altasoft.exchange.channel;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    private final ChannelService channelService;

    @Autowired
    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping("/create")
    public ResponseEntity<Channel> createChannel(@RequestBody CreateChannelRequest request) {
        Channel channel = channelService.createChannel(request.getName(), request.getCreatorUserName(), request.isPrivate(), request.getParentId());
        return new ResponseEntity<>(channel, HttpStatus.CREATED);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeToChannel(@RequestBody SubscribeToChannelRequest request) {
        channelService.subscribeToChannel(request.getUserName(), request.getChannelId());
        return ResponseEntity.ok("Subscribed to channel");
    }

    @PostMapping("/invite")
    public ResponseEntity<String> inviteToChannel(@RequestBody InviteToChannelRequest request) {
        channelService.inviteToChannel(request.getInviterUserName(), request.getInviteeUserName(), request.getChannelId());
        return ResponseEntity.ok("Invitation sent");
    }

    @Getter
    @Setter
    public static class CreateChannelRequest {
        private String name;
        private String creatorUserName;
        private boolean isPrivate;
        private Integer parentId;
    }

    @Getter
    @Setter
    public static class SubscribeToChannelRequest {
        private String userName;
        private Integer channelId;
    }

    @Getter
    @Setter
    public static class InviteToChannelRequest {
        private String inviterUserName;
        private String inviteeUserName;
        private Integer channelId;
    }
}
