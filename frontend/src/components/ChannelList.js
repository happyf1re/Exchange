import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, subscribeToChannel, unsubscribeFromChannel } from '../store/actions/channelActions';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const ChannelList = ({ onSelectChannel }) => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels);
    const user = useSelector((state) => state.auth.user); // Получаем текущего пользователя
    const error = useSelector((state) => state.channels.error);

    useEffect(() => {
        dispatch(fetchChannels());
    }, [dispatch]);

    const handleSubscribe = (channelId) => {
        if (user) {
            dispatch(subscribeToChannel(channelId, user.id));
        }
    };

    const handleUnsubscribe = (channelId) => {
        if (user) {
            dispatch(unsubscribeFromChannel(channelId, user.id));
        }
    };

    if (!Array.isArray(channels)) {
        return <Typography variant="h6">No channels available</Typography>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Channels</Typography>
            {error && <Typography color="error">{JSON.stringify(error)}</Typography>}
            <List>
                {channels.map((channel) => (
                    <ListItem key={channel.id} button onClick={() => onSelectChannel(channel.id)}>
                        <ListItemText primary={channel.name} />
                        {channel.isSubscribed ? (
                            <Button variant="contained" color="secondary" onClick={(e) => { e.stopPropagation(); handleUnsubscribe(channel.id); }}>Unsubscribe</Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleSubscribe(channel.id); }}>Subscribe</Button>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChannelList;
