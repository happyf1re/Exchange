import { LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE } from '../types';

const initialState = {
    user: null,
    error: null,
    success: false,
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
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
        default:
            return state;
    }
}



