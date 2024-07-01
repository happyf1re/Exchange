import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/actions/authActions';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const unreadNotifications = useSelector((state) => state.notifications.unreadCount);
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Exchange v0.0.1
                </Typography>
                {user && (
                    <>
                        <Typography variant="body1" sx={{ marginRight: 2 }}>
                            Welcome, {user.userName}
                        </Typography>
                        <IconButton color="inherit" component={Link} to="/notifications">
                            <Badge badgeContent={unreadNotifications} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

