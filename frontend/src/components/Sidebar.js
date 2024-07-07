import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitations } from '../store/actions/invitationActions';
import { connectWebSocket, subscribeToInvitations } from '../websocket';

const Sidebar = () => {
    const dispatch = useDispatch();
    const unreadInvitations = useSelector((state) => state.invitations.unreadInvitations);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            dispatch(fetchInvitations(user.userName));

            connectWebSocket(user.userName, (message) => {
                if (message === 'NEW_INVITATION') {
                    dispatch(fetchInvitations(user.userName));
                }
            }).then(() => {
                subscribeToInvitations(user.userName, (message) => {
                    if (message === 'NEW_INVITATION') {
                        dispatch(fetchInvitations(user.userName));
                    }
                });
            });
        }
    }, [dispatch, user]);

    return (
        <Box sx={{ width: 250 }}>
            <Typography variant="h6" gutterBottom>Menu</Typography>
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/invitations">
                    <ListItemText primary="Invitations" />
                    {unreadInvitations > 0 && (
                        <Badge badgeContent={unreadInvitations} color="error" sx={{ marginLeft: 2 }} />
                    )}
                </ListItem>
                <ListItem button component={Link} to="/feed">
                    <ListItemText primary="Feed" />
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;

