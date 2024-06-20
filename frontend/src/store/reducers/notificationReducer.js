import { FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_FAILURE, MARK_AS_READ_SUCCESS, MARK_AS_READ_FAILURE } from '../types';

const initialState = {
    notifications: [],
    unreadCount: 0,
    error: null,
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                notifications: action.payload,
                unreadCount: action.payload.length,
                error: null,
            };
        case FETCH_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case MARK_AS_READ_SUCCESS:
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.payload),
                unreadCount: state.unreadCount - 1,
                error: null,
            };
        case MARK_AS_READ_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default notificationReducer;
