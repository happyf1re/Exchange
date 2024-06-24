import api from '../../api/api';
import {
    FETCH_CHANNELS_SUCCESS,
    FETCH_CHANNELS_FAILURE,
    SUBSCRIBE_CHANNEL_SUCCESS,
    UNSUBSCRIBE_CHANNEL_SUCCESS,
    CREATE_CHANNEL_SUCCESS,
    CREATE_CHANNEL_FAILURE
} from '../types';

export const fetchChannels = () => async (dispatch) => {
    try {
        const response = await api.get('/channels');
        dispatch({ type: FETCH_CHANNELS_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch({ type: FETCH_CHANNELS_FAILURE, payload: errorMessage });
    }
};

export const createChannel = (channelData) => async (dispatch) => {
    try {
        const response = await api.post('/channels/create', channelData);
        dispatch({ type: CREATE_CHANNEL_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch({ type: CREATE_CHANNEL_FAILURE, payload: errorMessage });
    }
};

export const subscribeToChannel = (channelId) => async (dispatch) => {
    try {
        const response = await api.post(`/channels/subscribe`, { channelId });
        dispatch({ type: SUBSCRIBE_CHANNEL_SUCCESS, payload: response.data });
    } catch (error) {
        console.error(error);
    }
};

export const unsubscribeFromChannel = (channelId) => async (dispatch) => {
    try {
        const response = await api.post(`/channels/unsubscribe`, { channelId });
        dispatch({ type: UNSUBSCRIBE_CHANNEL_SUCCESS, payload: response.data });
    } catch (error) {
        console.error(error);
    }
};




