package com.altasoft.exchange.subscription;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    List<Subscription> findByUser(User user);

    Optional<Subscription> findByUserAndChannel(User user, Channel channel);
}

