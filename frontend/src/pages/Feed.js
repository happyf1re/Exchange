import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFeed } from '../store/actions/messageActions';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { connectWebSocket, disconnectWebSocket, subscribeToChannel } from '../websocket';

const Feed = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.message.feed) || [];
    const user = useSelector((state) => state.auth.user);
    const subscribedChannels = useSelector((state) => state.channels.channels.filter(channel => channel.isSubscribed));
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserFeed(user.userName));

            connectWebSocket(user.userName, (message) => {
                dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
            }).then((client) => {
                setStompClient(client);
                subscribedChannels.forEach(channel => {
                    subscribeToChannel(channel.name, (message) => {
                        dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
                    });
                });
            }).catch((error) => {
                console.error('Error connecting WebSocket:', error);
            });
        }

        return () => {
            if (stompClient) {
                disconnectWebSocket();
            }
        };
    }, [dispatch, user, subscribedChannels, stompClient]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>My Feed</Typography>
                <List>
                    {messages.map((message) => (
                        <ListItem key={message.id}>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography variant="subtitle1" color="textPrimary">
                                            {message.channelName}
                                        </Typography>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            {message.authorUserName} - {new Date(message.timestamp).toLocaleString()}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={message.content}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default Feed;


