import api from '../../api/api';
import { FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_FAILURE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE } from '../types';

export const fetchChannelMessages = (channelId) => async (dispatch) => {
    try {
        const response = await api.get(`/messages/channel/${channelId}`);
        dispatch({ type: FETCH_MESSAGES_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_MESSAGES_FAILURE, payload: error.response.data });
    }
};

export const sendMessage = (channelId, message) => async (dispatch) => {
    try {
        const response = await api.post('/messages/send', { channelId, message });
        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: SEND_MESSAGE_FAILURE, payload: error.response.data });
    }
};

