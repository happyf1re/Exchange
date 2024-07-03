const initialState = {
    messages: [],
    feed: [],
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
        case 'FETCH_USER_FEED_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_USER_FEED_SUCCESS':
            return {
                ...state,
                loading: false,
                feed: action.payload,
            };
        case 'FETCH_USER_FEED_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case 'NEW_MESSAGE_RECEIVED':
            return {
                ...state,
                feed: [...state.feed, action.payload],
            };
        default:
            return state;
    }
};

export default messageReducer;

