package com.altasoft.exchange.channel;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    private final ChannelService channelService;

    @Autowired
    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping("/create")
    public ResponseEntity<Channel> createChannel(@RequestBody ChannelController.CreateChannelRequest request) {
        Channel channel = channelService.createChannel(request.getName(), request.getCreatorUserName(), request.isPrivate(), request.getParentId());
        return new ResponseEntity<>(channel, HttpStatus.CREATED);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeToChannel(@RequestBody SubscribeToChannelRequest request) {
        channelService.subscribeToChannel(request.getUserName(), request.getChannelId());
        return ResponseEntity.ok("Subscribed to channel");
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribeFromChannel(@RequestBody SubscribeToChannelRequest request) {
        channelService.unsubscribeFromChannel(request.getUserName(), request.getChannelId());
        return ResponseEntity.ok("Unsubscribed from channel");
    }

    @PostMapping("/invite")
    public ResponseEntity<String> inviteToChannel(@RequestBody InviteToChannelRequest request) {
        channelService.inviteToChannel(request.getInviterUserName(), request.getInviteeUserName(), request.getChannelId());
        return ResponseEntity.ok("Invitation sent");
    }

    @GetMapping
    public ResponseEntity<List<Channel>> getAllChannels() {
        List<Channel> channels = channelService.getAllChannels();
        return new ResponseEntity<>(channels, HttpStatus.OK);
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
