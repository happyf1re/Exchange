package com.altasoft.exchange.notification;

import com.altasoft.exchange.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserAndIsReadFalse(User user);
    Optional<Notification> findById(Integer id);
}

