import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invitations from './pages/Invitations';
import Header from './components/Header';
import { fetchChannels } from './store/actions/channelActions';

const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            dispatch(fetchChannels());
        }
    }, [dispatch, user]);

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




