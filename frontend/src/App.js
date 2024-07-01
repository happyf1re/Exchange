import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invitations from './pages/Invitations';
import Header from './components/Header';
import { checkAuth } from './store/actions/authActions';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (localStorage.getItem('user')) {
            dispatch(checkAuth());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        if (user) {
            console.log("User is authenticated:", user);
        } else {
            console.log("No user found");
            navigate('/login');
        }
    }, [user, navigate]);

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



