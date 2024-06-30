import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invitations from './pages/Invitations';
import Header from './components/Header';
import { fetchChannels } from './store/actions/channelActions';
import { checkAuth } from './store/actions/authActions';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            console.log("User is authenticated:", user);
            dispatch(fetchChannels());
        } else {
            console.log("No user found");
            navigate('/login');
        }
    }, [dispatch, user, navigate]);

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invitations" element={<Invitations />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;



