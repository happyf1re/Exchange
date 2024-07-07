import {
    FETCH_INVITATIONS_SUCCESS,
    FETCH_INVITATIONS_FAILURE,
    ACCEPT_INVITATION_SUCCESS,
    ACCEPT_INVITATION_FAILURE,
    FETCH_AVAILABLE_USERS_SUCCESS,
    FETCH_AVAILABLE_USERS_FAILURE,
    INVITE_USERS_SUCCESS,
    INVITE_USERS_FAILURE,
    REJECT_INVITATION_SUCCESS, // Добавлено
    REJECT_INVITATION_FAILURE  // Добавлено
} from '../types';

const initialState = {
    invitations: [],
    availableUsers: [],
    unreadInvitations: 0, // добавляем счётчик непринятых приглашений
    error: null,
};

const invitationReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_INVITATIONS_SUCCESS:
            return {
                ...state,
                invitations: action.payload,
                unreadInvitations: action.payload.length, // устанавливаем счётчик
                error: null,
            };
        case FETCH_INVITATIONS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case ACCEPT_INVITATION_SUCCESS:
        case REJECT_INVITATION_SUCCESS: // Обработка отклонения приглашения
            return {
                ...state,
                invitations: state.invitations.filter(invitation => invitation.id !== action.payload),
                unreadInvitations: state.unreadInvitations - 1, // уменьшаем счётчик
                error: null,
            };
        case ACCEPT_INVITATION_FAILURE:
        case REJECT_INVITATION_FAILURE: // Обработка ошибки отклонения
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_AVAILABLE_USERS_SUCCESS:
            return {
                ...state,
                availableUsers: action.payload,
                error: null,
            };
        case FETCH_AVAILABLE_USERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case INVITE_USERS_SUCCESS:
            return {
                ...state,
                error: null,
            };
        case INVITE_USERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default invitationReducer;

