import { FETCH_CHANNELS_SUCCESS, FETCH_CHANNELS_FAILURE, SUBSCRIBE_SUCCESS, SUBSCRIBE_FAILURE, UNSUBSCRIBE_SUCCESS, UNSUBSCRIBE_FAILURE } from '../types';

const initialState = {
    channels: [],
    error: null,
};

const channelReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CHANNELS_SUCCESS:
            return {
                ...state,
                channels: action.payload,
                error: null,
            };
        case FETCH_CHANNELS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case SUBSCRIBE_SUCCESS:
        case UNSUBSCRIBE_SUCCESS:
            return {
                ...state,
                error: null,
            };
        case SUBSCRIBE_FAILURE:
        case UNSUBSCRIBE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default channelReducer;
