import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { handleResponse } from '@/_helpers';

import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    register,
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function register(email, username, password, usertype) {
    const configOptions = {
        headers: { 'Content-Type': 'application/json' },
    };

    return axios.post(`${config.apiUrl}/users/register`, { 'email': email, 'username': username, 'password': password, 'usertype': usertype}, configOptions)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            //localStorage.setItem('currentUser', JSON.stringify(user.data));
            //currentUserSubject.next(user.data);

            //return user.data;
        })
        .catch((error)=>Promise.reject(error.response.data.message));
}

function login(username, password) {
    const configOptions = {
        headers: { 'Content-Type': 'application/json' },
    };

    return axios.post(`${config.apiUrl}/users/authenticate`, { 'username': username, 'password': password }, configOptions)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            localStorage.setItem('currentUser', JSON.stringify(user.data));
            currentUserSubject.next(user.data);

            return user.data;
        })
        .catch((error)=>Promise.reject(error.response.data.message));
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
