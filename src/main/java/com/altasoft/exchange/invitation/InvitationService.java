package com.altasoft.exchange.invitation;

import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.subscription.SubscriptionRepository;
import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.channel.ChannelRepository;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final ChannelRepository channelRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public InvitationService(InvitationRepository invitationRepository, UserRepository userRepository, ChannelRepository channelRepository, SubscriptionRepository subscriptionRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.subscriptionRepository = subscriptionRepository;
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
}


