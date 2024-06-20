import { FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_FAILURE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE } from '../types';

const initialState = {
    messages: [],
    error: null,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                messages: action.payload,
                error: null,
            };
        case FETCH_MESSAGES_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                error: null,
            };
        case SEND_MESSAGE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default messageReducer;
