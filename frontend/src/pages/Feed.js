import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFeed } from '../store/actions/messageActions';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar'; // добавляем Sidebar

const Feed = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.message.feed) || [];
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserFeed(user.userName));
        }
    }, [dispatch, user]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar /> {/* добавляем Sidebar */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>My Feed</Typography>
                <List>
                    {messages.map((message) => (
                        <ListItem key={message.id}>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography variant="subtitle1" color="textPrimary">
                                            {message.channelName} {/* Отображаем название канала только в ленте */}
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


