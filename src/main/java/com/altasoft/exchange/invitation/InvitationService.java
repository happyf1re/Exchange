package com.altasoft.exchange.invitation;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.channel.ChannelRepository;
import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.subscription.SubscriptionRepository;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public InvitationService(InvitationRepository invitationRepository, UserRepository userRepository, ChannelRepository channelRepository, SubscriptionRepository subscriptionRepository, SimpMessagingTemplate messagingTemplate) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public List<Invitation> getInvitationsForUser(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        return invitationRepository.findByInvitee(user);
    }

    @Transactional
    public void acceptInvitation(Integer invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found: " + invitationId));

        Channel channel = invitation.getChannel();
        User invitee = invitation.getInvitee();

        Subscription subscription = new Subscription();
        subscription.setUser(invitee);
        subscription.setChannel(channel);
        subscriptionRepository.save(subscription);

        channel.getSubscribers().add(subscription);
        channelRepository.save(channel);
        invitationRepository.delete(invitation);
    }

    @Transactional
    public void rejectInvitation(Integer invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found: " + invitationId));
        invitationRepository.delete(invitation);
    }

    @Transactional
    public List<User> getUsersNotSubscribedToChannel(Integer channelId) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));

        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(user -> !channel.getSubscribers().contains(user))
                .collect(Collectors.toList());
    }

    @Transactional
    public void inviteUsers(Integer channelId, List<Integer> userIds, String inviterUserName) {
        User inviter = userRepository.findByUserName(inviterUserName)
                .orElseThrow(() -> new RuntimeException("User not found: " + inviterUserName));
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));

        List<User> usersToInvite = userRepository.findAllById(userIds);
        for (User invitee : usersToInvite) {
            Invitation invitation = new Invitation();
            invitation.setChannel(channel);
            invitation.setInviter(inviter);
            invitation.setInvitee(invitee);
            invitation.setTimestamp(LocalDateTime.now());
            invitationRepository.save(invitation);

            // Отправляем уведомление через WebSocket
            messagingTemplate.convertAndSendToUser(invitee.getUserName(), "/queue/invitations", "NEW_INVITATION");
        }
    }
}





