import api from '../../api/api';
import { FETCH_CHANNELS_SUCCESS, FETCH_CHANNELS_FAILURE, SUBSCRIBE_SUCCESS, SUBSCRIBE_FAILURE, UNSUBSCRIBE_SUCCESS, UNSUBSCRIBE_FAILURE } from '../types';

export const fetchChannels = () => async (dispatch) => {
    try {
        const response = await api.get('/channels/all');
        dispatch({ type: FETCH_CHANNELS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_CHANNELS_FAILURE, payload: error.response.data });
    }
};

export const subscribeToChannel = (channelId) => async (dispatch) => {
    try {
        const response = await api.post('/channels/subscribe', { channelId });
        dispatch({ type: SUBSCRIBE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: SUBSCRIBE_FAILURE, payload: error.response.data });
    }
};

export const unsubscribeFromChannel = (channelId) => async (dispatch) => {
    try {
        const response = await api.post('/channels/unsubscribe', { channelId });
        dispatch({ type: UNSUBSCRIBE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: UNSUBSCRIBE_FAILURE, payload: error.response.data });
    }
};

