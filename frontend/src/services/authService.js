import axios from 'axios';

const API_URL = 'https://exchange.a-m0.ru/api/v1/users';

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem('user', JSON.stringify(response.data)); // Сохраняем данные пользователя
    return response.data;
};

const isAuthenticated = () => {
    return !!localStorage.getItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const logout = () => {
    localStorage.removeItem('user');
};

export default {
    register,
    login,
    isAuthenticated,
    getCurrentUser,
    logout,
};




