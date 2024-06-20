import api from '../../api/api';
import { FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_FAILURE, MARK_AS_READ_SUCCESS, MARK_AS_READ_FAILURE } from '../types';

export const fetchNotifications = (userName) => async (dispatch) => {
    try {
        const response = await api.get(`/notifications/unread/${userName}`);
        dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_NOTIFICATIONS_FAILURE, payload: error.response.data });
    }
};

export const markAsRead = (notificationId) => async (dispatch) => {
    try {
        const response = await api.post(`/notifications/mark-as-read/${notificationId}`);
        dispatch({ type: MARK_AS_READ_SUCCESS, payload: notificationId });
    } catch (error) {
        dispatch({ type: MARK_AS_READ_FAILURE, payload: error.response.data });
    }
};

