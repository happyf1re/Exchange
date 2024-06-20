import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, subscribeToChannel, unsubscribeFromChannel } from '../store/actions/channelActions';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const ChannelList = ({ onSelectChannel }) => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels);

    useEffect(() => {
        dispatch(fetchChannels());
    }, [dispatch]);

    const handleSubscribe = (channelId) => {
        dispatch(subscribeToChannel(channelId));
    };

    const handleUnsubscribe = (channelId) => {
        dispatch(unsubscribeFromChannel(channelId));
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Channels</Typography>
            <List>
                {channels.map((channel) => (
                    <ListItem key={channel.id} button onClick={() => onSelectChannel(channel.id)}>
                        <ListItemText primary={channel.name} />
                        {channel.isSubscribed ? (
                            <Button variant="contained" color="secondary" onClick={() => handleUnsubscribe(channel.id)}>Unsubscribe</Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => handleSubscribe(channel.id)}>Subscribe</Button>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChannelList;
