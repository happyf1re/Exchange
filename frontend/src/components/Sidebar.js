import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <Box sx={{ width: 250 }}>
            <Typography variant="h6" gutterBottom>Menu</Typography>
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/invitations">
                    <ListItemText primary="Invitations" />
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;
