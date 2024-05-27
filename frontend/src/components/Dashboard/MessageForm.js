import React, { useState } from 'react';
import messageService from '../../services/messageService';
import authService from '../../services/authService';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const MessageForm = () => {
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const currentUser = authService.getCurrentUser();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await messageService.sendMessage({
                recipientUserName: recipient,
                message: message,
                authorUserName: currentUser.userName, // Используем имя текущего пользователя
            });
            setRecipient('');
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <Form onSubmit={handleSendMessage}>
            <Input
                type="text"
                placeholder="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Send</Button>
        </Form>
    );
};

export default MessageForm;
