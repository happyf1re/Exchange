import api from '../../api/api';
import { FETCH_INVITATIONS_SUCCESS, FETCH_INVITATIONS_FAILURE, ACCEPT_INVITATION_SUCCESS, ACCEPT_INVITATION_FAILURE } from '../types';

export const fetchInvitations = () => async (dispatch) => {
    try {
        const response = await api.get('/invitations/user');
        dispatch({ type: FETCH_INVITATIONS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_INVITATIONS_FAILURE, payload: error.response.data });
    }
};

export const acceptInvitation = (invitationId) => async (dispatch) => {
    try {
        const response = await api.post(`/invitations/accept/${invitationId}`);
        dispatch({ type: ACCEPT_INVITATION_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: ACCEPT_INVITATION_FAILURE, payload: error.response.data });
    }
};



