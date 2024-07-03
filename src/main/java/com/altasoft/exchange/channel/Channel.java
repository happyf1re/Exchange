package com.altasoft.exchange.channel;

import com.altasoft.exchange.message.Message;
import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "channels")
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @JsonProperty("isPrivate")
    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Channel parent;

    @OneToMany(mappedBy = "parent")
    private Set<Channel> subChannels;

    @Transient
    @JsonProperty("isSubscribed")
    private boolean isSubscribed;

    @OneToMany(mappedBy = "channel")
    private Set<Subscription> subscribers;

    @OneToMany(mappedBy = "channel")
    @JsonManagedReference
    private Set<Message> messages;

    public void setIsSubscribed(boolean isSubscribed) {
        this.isSubscribed = isSubscribed;
    }

}



