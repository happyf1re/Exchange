package com.altasoft.exchange.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread/{userName}")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userName) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userName);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/mark-as-read/{id}")
    public ResponseEntity<String> markAsRead(@PathVariable Integer id) {
        Notification notification = notificationService.getNotificationById(id);
        notification.setRead(true);
        notificationService.save(notification);
        return ResponseEntity.ok("Notification marked as read");
    }
}

