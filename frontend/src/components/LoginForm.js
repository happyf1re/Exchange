import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom'; // Добавляем хук useNavigate

const LoginForm = ({ toggleForm }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Определяем navigate
    const { error, user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ userName, password }));
    };

    useEffect(() => {
        if (user) {
            navigate('/dashboard'); // Используем navigate для перенаправления
        }
    }, [user, navigate]);

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
                <Typography color="error" variant="body2" gutterBottom>
                    {typeof error === 'object' ? JSON.stringify(error) : error}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
            </Button>
            <Button fullWidth onClick={toggleForm}>
                Register
            </Button>
        </Box>
    );
};

export default LoginForm;
