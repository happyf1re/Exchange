import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannelMessages, sendMessage } from '../store/actions/messageActions';
import { List, ListItem, ListItemText, TextField, Button, Box, Typography } from '@mui/material';

const ChannelMessages = ({ channelId }) => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        dispatch(fetchChannelMessages(channelId));
    }, [dispatch, channelId]);

    const handleSendMessage = () => {
        dispatch(sendMessage(channelId, newMessage));
        setNewMessage('');
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Messages</Typography>
            <List>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <ListItemText primary={message.content} />
                    </ListItem>
                ))}
            </List>
            <TextField
                fullWidth
                margin="normal"
                label="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>Send Message</Button>
        </Box>
    );
};

export default ChannelMessages;
