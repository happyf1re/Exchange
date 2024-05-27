import axios from 'axios';

const API_URL = 'https://exchange.a-m0.ru/api/v1/messages';

const sendMessage = async (messageData) => {
    const response = await axios.post(`${API_URL}/send`, messageData);
    return response.data;
};

const getReceivedMessages = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(`${API_URL}/received/${user.userName}`);
    return response.data;
};

const getSentMessages = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(`${API_URL}/sent/${user.userName}`);
    return response.data;
};

export default {
    sendMessage,
    getReceivedMessages,
    getSentMessages,
};

