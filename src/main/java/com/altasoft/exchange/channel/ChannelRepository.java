package com.altasoft.exchange.channel;

import com.altasoft.exchange.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Integer> {
    List<Channel> findByCreator(User creator);
    List<Channel> findBySubscribersContaining(User user);
}
