import React from 'react';
import { Box, Container, Paper, Grid } from '@mui/material';
import InvitationList from '../components/InvitationList';
import Sidebar from '../components/Sidebar';

const Invitations = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                            <InvitationList />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Invitations;

