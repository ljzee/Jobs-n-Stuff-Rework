import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { handleResponse } from '@/_helpers';

import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const configOptions = {
        headers: { 'Content-Type': 'application/json' },
        data: { 'username': username, 'password': password }
    };

    return axios.post(`${config.apiUrl}/users/authenticate`, configOptions)
        .then(user => {
          //console.log(user.data);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user.data));
            currentUserSubject.next(user.data);

            return user.data;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
