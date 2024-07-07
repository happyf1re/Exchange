import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invitations from './pages/Invitations';
import Feed from './pages/Feed';
import Header from './components/Header';
import { checkAuth } from './store/actions/authActions';
import { connectWebSocket, subscribeToChannel, disconnectWebSocket } from './websocket';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const channels = useSelector((state) => state.channels.channels);

    useEffect(() => {
        if (localStorage.getItem('user')) {
            dispatch(checkAuth());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        let connected = false; // флаг для проверки состояния подключения
        if (user) {
            console.log("User is authenticated:", user);
            connectWebSocket(user.userName, (message) => {
                console.log("Received WebSocket message:", message);
                dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
            }).then(() => {
                connected = true;
            });

            return () => {
                if (connected) {
                    disconnectWebSocket();
                }
            };
        } else {
            console.log("No user found");
            navigate('/login');
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        if (channels.length > 0) {
            channels.forEach(channel => {
                if (channel.isSubscribed) {
                    subscribeToChannel(channel.name, (message) => {
                        console.log(`Received WebSocket message for channel ${channel.name}:`, message);
                        dispatch({ type: 'NEW_MESSAGE_RECEIVED', payload: message });
                    });
                }
            });
        }
    }, [channels, dispatch]);

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invitations" element={<Invitations />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </div>
    );
};

export default App;


