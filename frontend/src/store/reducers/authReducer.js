import { LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE, CHECK_AUTH, LOGOUT } from '../types';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
    success: false,
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            console.log('Login successful:', action.payload); // Добавьте эту строку
            return {
                ...state,
                user: action.payload,
                error: null,
                success: false,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                error: action.payload,
                success: false,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                success: true,
                error: null,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                success: false,
                error: action.payload,
            };
        case CHECK_AUTH:
            return {
                ...state,
                user: action.payload,
                error: null,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                error: null,
            };
        default:
            return state;
    }
}





