import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/actions/authActions';
import { TextField, Button, Box, Typography } from '@mui/material';

const RegisterForm = ({ toggleForm }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const handleRegister = () => {
        dispatch(registerUser({ userName, password, email }));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Register</Typography>
            <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleRegister}>Register</Button>
            <Button variant="text" color="secondary" onClick={toggleForm}>Switch to Login</Button>
        </Box>
    );
};

export default RegisterForm;
