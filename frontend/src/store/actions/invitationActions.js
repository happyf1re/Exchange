import api from '../../api/api';
import {
    FETCH_INVITATIONS_SUCCESS,
    FETCH_INVITATIONS_FAILURE,
    ACCEPT_INVITATION_SUCCESS,
    ACCEPT_INVITATION_FAILURE,
    FETCH_AVAILABLE_USERS_SUCCESS,
    FETCH_AVAILABLE_USERS_FAILURE,
    INVITE_USERS_SUCCESS,
    INVITE_USERS_FAILURE
} from '../types';

export const fetchAvailableUsers = (channelId) => async (dispatch) => {
    try {
        const response = await api.get(`/invitations/available-users/${channelId}`);
        dispatch({ type: FETCH_AVAILABLE_USERS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_AVAILABLE_USERS_FAILURE, payload: error.response.data });
    }
};

export const inviteUsers = (channelId, userIds, inviterUserName) => async (dispatch) => {
    try {
        await api.post('/invitations/invite', { channelId, userIds, inviterUserName });
        dispatch({ type: INVITE_USERS_SUCCESS });
    } catch (error) {
        dispatch({ type: INVITE_USERS_FAILURE, payload: error.response.data });
    }
};

export const fetchInvitations = (userName) => async (dispatch) => {
    try {
        const response = await api.get(`/invitations/user/${userName}`);
        dispatch({ type: FETCH_INVITATIONS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_INVITATIONS_FAILURE, payload: error.response.data });
    }
};

export const acceptInvitation = (invitationId) => async (dispatch) => {
    try {
        await api.post(`/invitations/accept/${invitationId}`);
        dispatch({ type: ACCEPT_INVITATION_SUCCESS, payload: invitationId });
    } catch (error) {
        dispatch({ type: ACCEPT_INVITATION_FAILURE, payload: error.response.data });
    }
};





