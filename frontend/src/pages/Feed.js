import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFeed } from '../store/actions/messageActions';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { connectWebSocket, disconnectWebSocket } from '../websocket';

const Feed = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.message.feed) || [];
    const user = useSelector((state) => state.auth.user);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserFeed(user.userName));

            const client = connectWebSocket(user.userName, (message) => {
                dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
            });
            setStompClient(client);
        }

        return () => {
            if (stompClient) {
                disconnectWebSocket();
            }
        };
    }, [dispatch, user, stompClient]);

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


