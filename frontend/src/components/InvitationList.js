import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitations, acceptInvitation } from '../store/actions/invitationActions';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const InvitationList = () => {
    const dispatch = useDispatch();
    const invitations = useSelector((state) => state.invitations);

    useEffect(() => {
        dispatch(fetchInvitations());
    }, [dispatch]);

    const handleAccept = (invitationId) => {
        dispatch(acceptInvitation(invitationId));
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Invitations</Typography>
            <List>
                {invitations.map((invitation) => (
                    <ListItem key={invitation.id}>
                        <ListItemText primary={`Invitation to ${invitation.channel.name} from ${invitation.inviter.userName}`} />
                        <Button variant="contained" color="primary" onClick={() => handleAccept(invitation.id)}>Accept</Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default InvitationList;
