import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import authService from '../services/authService';

const NavBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <NavBarContainer>
            <NavLinks>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/sent-messages">Sent Messages</Link>
            </NavLinks>
            <NavButton onClick={handleLogout}>Logout</NavButton>
        </NavBarContainer>
    );
};

export default NavBar;
