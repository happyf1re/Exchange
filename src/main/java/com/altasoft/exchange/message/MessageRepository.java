package com.altasoft.exchange.message;

import com.altasoft.exchange.channel.Channel;
import com.altasoft.exchange.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByChannelId(Integer channelId);

    boolean existsById(Integer id);

    List<Message> findByAuthor(User user);

    List<Message> findByChannelIn(List<Channel> subscribedChannels);
}





