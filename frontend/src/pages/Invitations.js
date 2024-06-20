import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import InvitationList from '../components/InvitationList';

const Invitations = () => {
    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                <InvitationList />
            </Paper>
        </Container>
    );
};

export default Invitations;
