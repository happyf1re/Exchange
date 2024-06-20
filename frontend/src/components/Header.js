import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
    const unreadNotifications = useSelector((state) => state.notifications.unreadCount);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <IconButton color="inherit" component={Link} to="/notifications">
                    <Badge badgeContent={unreadNotifications} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
