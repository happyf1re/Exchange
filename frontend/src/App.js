import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invitations from './pages/Invitations';
import Header from './components/Header';

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invitations" element={<Invitations />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </div>
    );
};

export default App;

