package com.altasoft.exchange.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class TopicConfig {

    //немного захардкодим названия топиков

    private String mainTopic = "main-topic";
    private String user1Topic = "user1-topic";
    private String user2Topic = "user2-topic";
    private String user3Topic = "user3-topic";

    @Bean
    public NewTopic mainTopic() {
        return TopicBuilder.name(mainTopic)
                .build();
    }

    @Bean
    public NewTopic user1Topic() {
        return TopicBuilder.name(user1Topic)
                .build();
    }

    @Bean
    public NewTopic user2Topic() {
        return TopicBuilder.name(user2Topic)
                .build();
    }

    @Bean
    public NewTopic user3Topic() {
        return TopicBuilder.name(user3Topic)
                .build();
    }
}
