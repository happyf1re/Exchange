import api from '../../api/api';
import { LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE } from '../types';

export const loginUser = (credentials) => async (dispatch) => {
    try {
        const response = await api.post('/users/login', credentials);
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


