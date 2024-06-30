package com.altasoft.exchange.channel;

import com.altasoft.exchange.message.Message;
import com.altasoft.exchange.subscription.Subscription;
import com.altasoft.exchange.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "_channels")
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(nullable = false)
    private boolean isPrivate;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Channel parent;

    @OneToMany(mappedBy = "parent")
    private Set<Channel> subChannels = new HashSet<>();

    @OneToMany(mappedBy = "channel")
    private Set<Subscription> subscribers = new HashSet<>();

    @OneToMany(mappedBy = "channel")
    @JsonManagedReference
    private Set<Message> messages = new HashSet<>();
}



