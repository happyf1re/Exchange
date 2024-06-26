import axios from 'axios';

const api = axios.create({
    baseURL: 'https://exchange.a-m0.ru/api/v1',
    withCredentials: true,
});

export default api;
