const initialState = {
    messages: [],
    loading: false,
    error: null,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_MESSAGES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_MESSAGES_SUCCESS':
            return {
                ...state,
                loading: false,
                messages: action.payload,
            };
        case 'FETCH_MESSAGES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case 'SEND_MESSAGE_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'SEND_MESSAGE_SUCCESS':
            return {
                ...state,
                loading: false,
                messages: [...state.messages, action.payload],
            };
        case 'SEND_MESSAGE_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export default messageReducer;

