package com.altasoft.exchange.invitation;

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

    private InvitationDTO convertToDto(Invitation invitation) {
        InvitationDTO invitationDTO = new InvitationDTO();
        invitationDTO.setId(invitation.getId());
        invitationDTO.setChannelId(invitation.getChannel().getId());
        invitationDTO.setInviterUserName(invitation.getInviter().getUserName());
        invitationDTO.setInviteeUserName(invitation.getInvitee().getUserName());
        invitationDTO.setTimestamp(invitation.getTimestamp());
        return invitationDTO;
    }
}


