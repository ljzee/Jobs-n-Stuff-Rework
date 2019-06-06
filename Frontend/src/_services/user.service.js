import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

import axios from 'axios';

export const userService = {
    getAll,
    getById
};

function getAll() {
    return axios.get(`${config.apiUrl}/users`, {headers: authHeader()}).then(result => result.data);
}

function getById(id) {
    return axios.get(`${config.apiUrl}/users/${id}`, {headers: authHeader()}).then(result=> {
    //console.log(result);
  return result.data;
});
}
