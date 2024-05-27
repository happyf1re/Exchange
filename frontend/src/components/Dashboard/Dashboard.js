import React, { useState, useEffect } from 'react';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import NavBar from '../NavBar';
import messageService from '../../services/messageService';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Dashboard = () => {
    const [receivedMessages, setReceivedMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await messageService.getReceivedMessages();
                setReceivedMessages(messages);
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
                <h2>Dashboard</h2>
                <MessageForm />
                <h3>Received Messages</h3>
                <MessageList messages={receivedMessages} />
            </Container>
        </>
    );
};

export default Dashboard;
