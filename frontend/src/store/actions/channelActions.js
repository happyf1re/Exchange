import api from '../../api/api';
import {
    CREATE_CHANNEL_SUCCESS,
    CREATE_CHANNEL_FAILURE,
    FETCH_CHANNELS_SUCCESS,
    FETCH_CHANNELS_FAILURE,
    SUBSCRIBE_CHANNEL_SUCCESS,
    UNSUBSCRIBE_CHANNEL_SUCCESS,
} from '../types';

export const fetchChannels = () => async (dispatch, getState) => {
    try {
        const { user } = getState().auth;
        const response = await api.get('/channels');
        const channels = response.data;

        if (user) {
            const subscriptionsResponse = await api.get(`/subscriptions/user/${user.userName}`);
            const subscribedChannelIds = subscriptionsResponse.data.map(sub => sub.channelId);

            const channelsWithSubscriptions = channels.map(channel => ({
                ...channel,
                isSubscribed: subscribedChannelIds.includes(channel.id),
            }));

            dispatch({ type: FETCH_CHANNELS_SUCCESS, payload: channelsWithSubscriptions });
        } else {
            dispatch({ type: FETCH_CHANNELS_SUCCESS, payload: channels });
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch({ type: FETCH_CHANNELS_FAILURE, payload: errorMessage });
    }
};

export const createChannel = (channelData) => async (dispatch) => {
    try {
        const response = await api.post('/channels/create', channelData);
        dispatch({ type: CREATE_CHANNEL_SUCCESS, payload: response.data });
        dispatch(fetchChannels());
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        dispatch({ type: CREATE_CHANNEL_FAILURE, payload: errorMessage });
    }
};

export const subscribeToChannel = (channelId, userName) => async (dispatch) => {
    try {
        await api.post('/channels/subscribe', { userName, channelId });
        dispatch({ type: SUBSCRIBE_CHANNEL_SUCCESS, payload: { channelId } });
    } catch (error) {
        console.error(error);
    }
};

export const unsubscribeFromChannel = (channelId, userName) => async (dispatch) => {
    try {
        await api.post('/channels/unsubscribe', { userName, channelId });
        dispatch({ type: UNSUBSCRIBE_CHANNEL_SUCCESS, payload: { channelId } });
    } catch (error) {
        console.error(error);
    }
};


