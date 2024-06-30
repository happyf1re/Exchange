import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannelMessages, sendMessage } from '../store/actions/messageActions';
import { List, ListItem, ListItemText, TextField, Button, Box, Typography } from '@mui/material';

const ChannelMessages = ({ channelId }) => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.message.messages) || [];
    const [newMessage, setNewMessage] = useState('');
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchChannelMessages(channelId));
    }, [dispatch, channelId]);

    const handleSendMessage = () => {
        if (newMessage.trim() && user) {
            dispatch(sendMessage(channelId, newMessage, user.userName)).then(() => {
                setNewMessage('');
                dispatch(fetchChannelMessages(channelId));
            });
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Messages</Typography>
            <List>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <ListItemText
                            primary={
                                <Typography variant="subtitle2" color="textSecondary">
                                    {message.authorUserName} - {new Date(message.timestamp).toLocaleString()}
                                </Typography>
                            }
                            secondary={message.content}
                        />
                    </ListItem>
                ))}
            </List>
            <Box display="flex" mt={2}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: '10px' }}>Send</Button>
            </Box>
        </Box>
    );
};

export default ChannelMessages;

