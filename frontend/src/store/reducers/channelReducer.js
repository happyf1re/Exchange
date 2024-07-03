import {
    FETCH_CHANNELS_SUCCESS,
    FETCH_CHANNELS_FAILURE,
    SUBSCRIBE_CHANNEL_SUCCESS,
    UNSUBSCRIBE_CHANNEL_SUCCESS,
    CREATE_CHANNEL_SUCCESS,
} from '../types';

const initialState = {
    channels: [],
    error: null,
};

export default function channelReducer(state = initialState, action) {
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
                channels: [],
                error: action.payload,
            };
        case SUBSCRIBE_CHANNEL_SUCCESS:
            return {
                ...state,
                channels: state.channels.map(channel =>
                    channel.id === action.payload.channelId ? { ...channel, isSubscribed: true } : channel
                ),
            };
        case UNSUBSCRIBE_CHANNEL_SUCCESS:
            return {
                ...state,
                channels: state.channels.map(channel =>
                    channel.id === action.payload.channelId ? { ...channel, isSubscribed: false } : channel
                ),
            };
        case CREATE_CHANNEL_SUCCESS:
            return {
                ...state,
                channels: [...state.channels, action.payload],
            };
        default:
            return state;
    }
}








