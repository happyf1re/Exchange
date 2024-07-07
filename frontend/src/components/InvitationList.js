import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitations, acceptInvitation, rejectInvitation } from '../store/actions/invitationActions';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const InvitationList = () => {
    const dispatch = useDispatch();
    const invitations = useSelector((state) => state.invitations.invitations);
    const error = useSelector((state) => state.invitations.error);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            dispatch(fetchInvitations(user.userName));
        }
    }, [dispatch, user]);

    const handleAccept = (invitationId) => {
        dispatch(acceptInvitation(invitationId));
    };

    const handleReject = (invitationId) => {
        dispatch(rejectInvitation(invitationId));
    };

    if (!Array.isArray(invitations)) {
        return <Typography variant="h6">No invitations available</Typography>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Invitations</Typography>
            {error && <Typography color="error">{JSON.stringify(error)}</Typography>}
            <List>
                {invitations.map((invitation) => (
                    <ListItem key={invitation.id}>
                        <ListItemText primary={`Invitation to ${invitation.channelName || 'unknown channel'} from ${invitation.inviterUserName}`} />
                        <Button variant="contained" color="primary" onClick={() => handleAccept(invitation.id)}>Accept</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleReject(invitation.id)}>Reject</Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default InvitationList;

