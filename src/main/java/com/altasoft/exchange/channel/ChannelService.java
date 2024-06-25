package com.altasoft.exchange.channel;

import com.altasoft.exchange.invitation.Invitation;
import com.altasoft.exchange.invitation.InvitationRepository;
import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.subscription.SubscriptionRepository;
import com.altasoft.exchange.user.User;
import com.altasoft.exchange.user.UserRepository;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final InvitationRepository invitationRepository;
    private final KafkaAdmin kafkaAdmin;

    @Autowired
    public ChannelService(ChannelRepository channelRepository, UserRepository userRepository, SubscriptionRepository subscriptionRepository, InvitationRepository invitationRepository, KafkaAdmin kafkaAdmin) {
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.invitationRepository = invitationRepository;
        this.kafkaAdmin = kafkaAdmin;
    }

    @Transactional
    public Channel createChannel(String name, String creatorUserName, boolean isPrivate, Integer parentId) {
        User creator = userRepository.findByUserName(creatorUserName)
                .orElseThrow(() -> new RuntimeException("User not found: " + creatorUserName));
        Channel parent = parentId != null ? channelRepository.findById(parentId).orElse(null) : null;

        Channel channel = new Channel();
        channel.setName(name);
        channel.setCreator(creator);
        channel.setPrivate(isPrivate);
        channel.setParent(parent);

        Channel savedChannel = channelRepository.save(channel);

        createKafkaTopic(name);

        return savedChannel;
    }

    private void createKafkaTopic(String topicName) {
        NewTopic topic = TopicBuilder.name(topicName)
                .partitions(1)
                .replicas(1)
                .build();
        kafkaAdmin.createOrModifyTopics(topic);
    }

    @Transactional
    public void subscribeToChannel(String userName, Integer channelId) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));

        if (channel.isPrivate() && !channel.getSubscribers().stream().anyMatch(subscription -> subscription.getUser().equals(user))) {
            throw new RuntimeException("Cannot subscribe to private channel without invitation.");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setChannel(channel);

        subscriptionRepository.save(subscription);

        channel.getSubscribers().add(subscription);
        channelRepository.save(channel);
    }

    @Transactional
    public void unsubscribeFromChannel(String userName, Integer channelId) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found: " + userName));
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));
        Subscription subscription = subscriptionRepository.findByUserAndChannel(user, channel)
                .orElseThrow(() -> new RuntimeException("No such subscription"));

        subscriptionRepository.delete(subscription);
        channel.getSubscribers().remove(subscription);
        channelRepository.save(channel);
    }

    @Transactional
    public void inviteToChannel(String inviterUserName, String inviteeUserName, Integer channelId) {
        User inviter = userRepository.findByUserName(inviterUserName)
                .orElseThrow(() -> new RuntimeException("User not found: " + inviterUserName));
        User invitee = userRepository.findByUserName(inviteeUserName)
                .orElseThrow(() -> new RuntimeException("User not found: " + inviteeUserName));
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));

        if (!channel.isPrivate()) {
            throw new RuntimeException("Cannot invite users to a public channel.");
        }

        Invitation invitation = new Invitation();
        invitation.setChannel(channel);
        invitation.setInviter(inviter);
        invitation.setInvitee(invitee);
        invitation.setTimestamp(LocalDateTime.now());

        invitationRepository.save(invitation);
    }

    public List<Channel> getAllChannels() {
        return channelRepository.findAll();
    }
}

