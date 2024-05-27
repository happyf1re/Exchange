import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar'; // Исправленный путь
import messageService from '../../services/messageService';
import MessageList from './MessageList'; // Добавленный импорт
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const SentMessages = () => {
    const [sentMessages, setSentMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await messageService.getSentMessages();
                setSentMessages(messages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();
    }, []);

    return (
        <>
            <NavBar />
            <Container>
                <h2>Sent Messages</h2>
                <MessageList messages={sentMessages} />
            </Container>
        </>
    );
};

export default SentMessages;
