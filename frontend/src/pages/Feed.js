import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFeed } from '../store/actions/messageActions';
import { connectWebSocket, disconnectWebSocket } from '../websocket';
import Sidebar from '../components/Sidebar';

const Feed = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.message.feed) || [];
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserFeed(user.userName));

            const stompClient = connectWebSocket(user.userName, (newMessage) => {
                dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: newMessage });
            });

            return () => {
                disconnectWebSocket();
            };
        }
    }, [dispatch, user]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" gutterBottom>My Feed</Typography>
                {messages.length === 0 ? (
                    <Typography variant="h6">No messages available</Typography>
                ) : (
                    <List>
                        {messages.map((message) => (
                            <ListItem key={message.id}>
                                <ListItemText
                                    primary={<Typography variant="subtitle2" color="textSecondary">
                                        {message.channelName} - {message.authorUserName} - {new Date(message.timestamp).toLocaleString()}
                                    </Typography>}
                                    secondary={message.content}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default Feed;


