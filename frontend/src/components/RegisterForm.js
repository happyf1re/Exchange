import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/actions/authActions';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ toggleForm }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, success } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ userName, password, email }));
    };

    // Перенаправление на страницу логина после успешной регистрации
    React.useEffect(() => {
        if (success) {
            navigate('/login');
        }
    }, [success, navigate]);

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Register
            </Typography>
            <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    {error}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
            </Button>
            <Button fullWidth onClick={toggleForm}>
                Login
            </Button>
        </Box>
    );
};

export default RegisterForm;
