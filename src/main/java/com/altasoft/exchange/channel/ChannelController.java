package com.altasoft.exchange.channel;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    private final ChannelService channelService;

    @Autowired
    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping("/create")
    public ResponseEntity<ChannelDTO> createChannel(@RequestBody ChannelDTO request) {
        System.out.println("Received create channel request: " + request);
        Channel channel = channelService.createChannel(request.getName(), request.getCreatorUserName(), request.isPrivate(), request.getParentId());
        System.out.println("Created channel: " + channel);
        return new ResponseEntity<>(convertToDto(channel), HttpStatus.CREATED);
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

    @GetMapping("/{userName}")
    public ResponseEntity<List<ChannelDTO>> getAllChannels(@PathVariable String userName) {
        List<Channel> channels = channelService.getAllChannels(userName);
        List<ChannelDTO> channelDTOs = channels.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(channelDTOs, HttpStatus.OK);
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

    private ChannelDTO convertToDto(Channel channel) {
        ChannelDTO channelDTO = new ChannelDTO();
        channelDTO.setId(channel.getId());
        channelDTO.setName(channel.getName());
        channelDTO.setCreatorUserName(channel.getCreator().getUserName());
        channelDTO.setPrivate(channel.isPrivate());
        channelDTO.setSubscribed(channel.isSubscribed()); // Добавляем информацию о подписке
        if (channel.getParent() != null) {
            channelDTO.setParentId(channel.getParent().getId());
        }
        return channelDTO;
    }
}

