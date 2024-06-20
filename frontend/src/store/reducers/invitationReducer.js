import { FETCH_INVITATIONS_SUCCESS, FETCH_INVITATIONS_FAILURE, ACCEPT_INVITATION_SUCCESS, ACCEPT_INVITATION_FAILURE } from '../types';

const initialState = {
    invitations: [],
    error: null,
};

const invitationReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_INVITATIONS_SUCCESS:
            return {
                ...state,
                invitations: action.payload,
                error: null,
            };
        case FETCH_INVITATIONS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case ACCEPT_INVITATION_SUCCESS:
            return {
                ...state,
                error: null,
            };
        case ACCEPT_INVITATION_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default invitationReducer;
