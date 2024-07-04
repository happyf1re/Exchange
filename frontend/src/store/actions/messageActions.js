import api from '../../api/api';

export const fetchChannelMessages = (channelId) => async (dispatch) => {
    dispatch({ type: 'FETCH_MESSAGES_REQUEST' });
    try {
        const response = await api.get(`/messages/channel/${channelId}`);
        dispatch({ type: 'FETCH_MESSAGES_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_MESSAGES_FAILURE', error: error.message });
    }
};

export const sendMessage = (channelId, message, authorUserName, channelName) => async (dispatch) => {
    dispatch({ type: 'SEND_MESSAGE_REQUEST' });
    try {
        const response = await api.post('/messages/send', { message, authorUserName, channelId, channelName });
        dispatch({ type: 'SEND_MESSAGE_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'SEND_MESSAGE_FAILURE', error: error.message });
    }
};


export const fetchUserFeed = (userName) => async (dispatch) => {
    dispatch({ type: 'FETCH_USER_FEED_REQUEST' });
    try {
        const response = await api.get(`/feed/${userName}`);
        dispatch({ type: 'FETCH_USER_FEED_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_USER_FEED_FAILURE', error: error.message });
    }
};




