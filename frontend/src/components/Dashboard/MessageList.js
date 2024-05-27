import React from 'react';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MessageList = ({ messages }) => {
    return (
        <List>
            {messages.map((message) => (
                <ListItem key={message.id}>
                    <strong>From:</strong> {message.author.userName}<br />
                    <strong>To:</strong> {message.recipient.userName}<br />
                    <strong>Message:</strong> {message.content}<br />
                    <strong>Timestamp:</strong> {message.timestamp}
                </ListItem>
            ))}
        </List>
    );
};

export default MessageList;
