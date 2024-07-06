import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, subscribeToChannel as reduxSubscribeToChannel, unsubscribeFromChannel } from '../store/actions/channelActions';
import { List, ListItem, ListItemText, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel } from '@mui/material';
import { fetchAvailableUsers, inviteUsers } from '../store/actions/invitationActions';
import { connectWebSocket, subscribeToChannel, isWebSocketConnected } from '../websocket';

const ChannelList = ({ onSelectChannel }) => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels);
    const user = useSelector((state) => state.auth.user);
    const availableUsers = useSelector((state) => state.invitations.availableUsers);
    const error = useSelector((state) => state.channels.error);
    const [open, setOpen] = useState(false);
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (user) {
            console.log('Fetching channels for user:', user.userName);
            dispatch(fetchChannels(user.userName));
        }
    }, [dispatch, user]);

    const handleSubscribe = async (channelId) => {
        if (user) {
            try {
                await ensureWebSocketConnection(user.userName);
                if (isWebSocketConnected()) {
                    console.log('Подписка на канал: ', channelId);
                    subscribeToChannel(channelId, (message) => {
                        dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
                    });
                    dispatch(reduxSubscribeToChannel(channelId, user.userName));
                } else {
                    console.error('Невозможно подписаться на канал. Нет STOMP соединения.');
                }
            } catch (error) {
                console.error('Ошибка при подписке на канал:', error);
            }
        }
    };

    const handleUnsubscribe = (channelId) => {
        if (user) {
            console.log('Отписка от канала: ', channelId);
            dispatch(unsubscribeFromChannel(channelId, user.userName));
        }
    };

    const handleInvite = (channelId) => {
        setSelectedChannelId(channelId);
        dispatch(fetchAvailableUsers(channelId));
        setOpen(true);
    };

    const handleInviteSubmit = () => {
        if (user) {
            dispatch(inviteUsers(selectedChannelId, selectedUsers, user.userName));
            setOpen(false);
            setSelectedUsers([]);
        }
    };

    const handleUserCheck = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const ensureWebSocketConnection = async (userName) => {
        return new Promise((resolve, reject) => {
            if (window.stompClient && window.stompClient.connected) {
                console.log('WebSocket уже подключен.');
                resolve(window.stompClient);
            } else {
                connectWebSocket(userName, (message) => {
                    dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
                }).then((stompClient) => {
                    window.stompClient = stompClient;
                    resolve(stompClient);
                }).catch((error) => {
                    console.error('Ошибка подключения WebSocket:', error);
                    reject(error);
                });
            }
        });
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
                        <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleInvite(channel.id); }}>Invite</Button>
                    </ListItem>
                ))}
            </List>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Invite Users</DialogTitle>
                <DialogContent>
                    {availableUsers.map(user => (
                        <FormControlLabel
                            key={user.id}
                            control={
                                <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserCheck(user.id)}
                                    color="primary"
                                />
                            }
                            label={user.userName}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleInviteSubmit} color="primary">Invite</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChannelList;



