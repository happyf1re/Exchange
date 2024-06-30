package com.altasoft.exchange.subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<SubscriptionDTO>> getUserSubscriptions(@PathVariable String userName) {
        List<SubscriptionDTO> subscriptions = subscriptionService.getUserSubscriptions(userName);
        return ResponseEntity.ok(subscriptions);
    }
}

