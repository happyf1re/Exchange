import axios from 'axios';

const api = axios.create({
    baseURL: 'https://exchange.a-m0.ru/api/v1',
    withCredentials: true,
});

export default api;

//https://exchange.a-m0.ru/api/v1
//http://localhost:8080/api/v1
