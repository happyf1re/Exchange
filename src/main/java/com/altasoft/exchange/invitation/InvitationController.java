package com.altasoft.exchange.invitation;

import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/invitations")
public class InvitationController {

    private final InvitationService invitationService;

    @Autowired
    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<InvitationDTO>> getInvitationsForUser(@PathVariable String userName) {
        List<Invitation> invitations = invitationService.getInvitationsForUser(userName);
        List<InvitationDTO> invitationDTOs = invitations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(invitationDTOs);
    }

    @PostMapping("/accept/{invitationId}")
    public ResponseEntity<String> acceptInvitation(@PathVariable Integer invitationId) {
        invitationService.acceptInvitation(invitationId);
        return ResponseEntity.ok("Invitation accepted");
    }

    @GetMapping("/available-users/{channelId}")
    public ResponseEntity<List<UserDTO>> getAvailableUsersForChannel(@PathVariable Integer channelId) {
        List<User> users = invitationService.getUsersNotSubscribedToChannel(channelId);
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @PostMapping("/invite")
    public ResponseEntity<String> inviteUsers(@RequestBody InviteUsersRequest request) {
        invitationService.inviteUsers(request.getChannelId(), request.getUserIds(), request.getInviterUserName());
        return ResponseEntity.ok("Invitations sent");
    }

    private InvitationDTO convertToDto(Invitation invitation) {
        InvitationDTO invitationDTO = new InvitationDTO();
        invitationDTO.setId(invitation.getId());
        invitationDTO.setChannelId(invitation.getChannel().getId());
        invitationDTO.setInviterUserName(invitation.getInviter().getUserName());
        invitationDTO.setInviteeUserName(invitation.getInvitee().getUserName());
        invitationDTO.setTimestamp(invitation.getTimestamp());
        return invitationDTO;
    }

    private UserDTO convertToDto(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUserName(user.getUserName());
        userDTO.setEmail(user.getEmail());
        return userDTO;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class InviteUsersRequest {
        private Integer channelId;
        private List<Integer> userIds;
        private String inviterUserName;
    }
}








