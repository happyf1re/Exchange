import React, { useState } from 'react';
import { Box, Container, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                {isRegistering ? (
                    <RegisterForm toggleForm={() => setIsRegistering(false)} />
                ) : (
                    <LoginForm toggleForm={() => setIsRegistering(true)} />
                )}
            </Paper>
        </Container>
    );
};

export default Login;
