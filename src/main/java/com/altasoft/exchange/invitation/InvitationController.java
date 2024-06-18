package com.altasoft.exchange.invitation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invitations")
public class InvitationController {

    private final InvitationService invitationService;

    @Autowired
    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<Invitation>> getInvitationsForUser(@PathVariable String userName) {
        List<Invitation> invitations = invitationService.getInvitationsForUser(userName);
        return ResponseEntity.ok(invitations);
    }

    @PostMapping("/accept/{invitationId}")
    public ResponseEntity<String> acceptInvitation(@PathVariable Integer invitationId) {
        invitationService.acceptInvitation(invitationId);
        return ResponseEntity.ok("Invitation accepted");
    }
}

