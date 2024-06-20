import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'; // Убедитесь, что импортируем правильно
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './reducers/authReducer';
import channelReducer from './reducers/channelReducer';
import messageReducer from './reducers/messageReducer';
import invitationReducer from './reducers/invitationReducer';
import notificationReducer from './reducers/notificationReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    channels: channelReducer,
    messages: messageReducer,
    invitations: invitationReducer,
    notifications: notificationReducer,
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
