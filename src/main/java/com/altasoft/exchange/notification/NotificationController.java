package com.altasoft.exchange.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread/{userName}")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable String userName) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userName);
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }

    @PostMapping("/mark-as-read/{id}")
    public ResponseEntity<String> markAsRead(@PathVariable Integer id) {
        Notification notification = notificationService.getNotificationById(id);
        notification.setRead(true);
        notificationService.save(notification);
        return ResponseEntity.ok("Notification marked as read");
    }

    private NotificationDTO convertToDto(Notification notification) {
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setUserName(notification.getUser().getUserName());
        notificationDTO.setMessage(notification.getMessage());
        notificationDTO.setRead(notification.isRead());
        notificationDTO.setTimestamp(notification.getTimestamp());
        return notificationDTO;
    }
}


