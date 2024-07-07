import {
    FETCH_INVITATIONS_SUCCESS,
    FETCH_INVITATIONS_FAILURE,
    ACCEPT_INVITATION_SUCCESS,
    ACCEPT_INVITATION_FAILURE,
    FETCH_AVAILABLE_USERS_SUCCESS,
    FETCH_AVAILABLE_USERS_FAILURE,
    INVITE_USERS_SUCCESS,
    INVITE_USERS_FAILURE,
    REJECT_INVITATION_SUCCESS,
    REJECT_INVITATION_FAILURE
} from '../types';

const initialState = {
    invitations: [],
    availableUsers: [],
    error: null,
    unreadInvitations: 0
};

const invitationReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_INVITATIONS_SUCCESS:
            return {
                ...state,
                invitations: action.payload,
                error: null,
                unreadInvitations: action.payload.length
            };
        case FETCH_INVITATIONS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case ACCEPT_INVITATION_SUCCESS:
        case REJECT_INVITATION_SUCCESS:
            return {
                ...state,
                invitations: state.invitations.filter(invitation => invitation.id !== action.payload),
                unreadInvitations: state.unreadInvitations - 1
            };
        case ACCEPT_INVITATION_FAILURE:
        case REJECT_INVITATION_FAILURE:
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

