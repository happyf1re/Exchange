import api from '../../api/api';
import { LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE, LOGOUT, CHECK_AUTH } from '../types';

export const loginUser = (credentials) => async (dispatch) => {
    try {
        const response = await api.post('/users/login', credentials);
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {
        const response = await api.post('/users/register', userData);
        dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    }
};

export const checkAuth = () => async (dispatch) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        try {
            const response = await api.get(`/users/${user.id}`);
            if (response.data) {
                dispatch({ type: CHECK_AUTH, payload: response.data });
            } else {
                localStorage.removeItem('user');
                dispatch({ type: LOGOUT });
            }
        } catch (error) {
            localStorage.removeItem('user');
            dispatch({ type: LOGOUT });
        }
    }
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
};




