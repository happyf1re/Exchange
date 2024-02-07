package com.altasoft.exchange.message;

//@Service
//public class MessageService {
////
////    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);
////
////    private final MessageRepository messageRepository;
////    private final UserRepository userRepository;
////    private final KafkaTemplate<String, String> kafkaTemplate;
////
////    @Autowired
////    public MessageService(MessageRepository messageRepository, UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate) {
////        this.messageRepository = messageRepository;
////        this.userRepository = userRepository;
////        this.kafkaTemplate = kafkaTemplate;
////    }
////
////    // Метод для приема сообщений из общего топика
////    @KafkaListener(topics = "my-topic")
////    public void receiveMessage(ConsumerRecord<String, String> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
////        logger.info("Received message: {} from topic: {}", record.value(), topic);
////        String targetUserName = new String(record.headers().lastHeader("targetUser").value(), StandardCharsets.UTF_8);
////        forwardMessageToUser(targetUserName, record.value());
////    }
////
////    // Перенаправление сообщения пользователю, основываясь на его имени
////    private void forwardMessageToUser(String userName, String content) {
////        Optional<User> userOpt = userRepository.findByUserName(userName);
////        if (userOpt.isPresent()) {
////            User user = userOpt.get();
////            String targetTopic = "topic-" + user.getId(); // Пример формирования имени целевого топика
////
////            // Сохранение сообщения в базе данных
////            saveMessage(user, content);
////
////            // Отправка сообщения в топик пользователя
////            kafkaTemplate.send(targetTopic, content);
////            logger.info("Message forwarded to topic: {}", targetTopic);
////        } else {
////            logger.error("User not found: {}", userName);
////        }
////    }
////
////    @Transactional
////    public void saveMessage(User user, String content) {
////        Message message = new Message();
////        message.setAuthor(user);
////        message.setContent(content);
////        message.setTimestamp(LocalDateTime.now());
////        messageRepository.save(message);
////        logger.info("Message saved to database");
////    }
//}
