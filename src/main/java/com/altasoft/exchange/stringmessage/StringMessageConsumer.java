package com.altasoft.exchange.stringmessage;

//@Service
//public class StringMessageConsumer {
//
//    private static final Logger LOGGER = LoggerFactory.getLogger(StringMessageConsumer.class);
//    private final StringMessageRepository stringMessageRepository;
//    private final UserRepository userRepository;
//    private final KafkaTemplate<String, String> kafkaTemplate;
//
//    public StringMessageConsumer(StringMessageRepository stringMessageRepository, UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate) {
//        this.stringMessageRepository = stringMessageRepository;
//        this.userRepository = userRepository;
//        this.kafkaTemplate = kafkaTemplate;
//    }
//
//    @KafkaListener(topics = "main-topic", groupId = "group-id")
//    @Transactional
//    public void listenToMainTopic(String message) {
//        LOGGER.info("Метод слушателя string message");
//
//        try {
//
//        }
//    }
//}
