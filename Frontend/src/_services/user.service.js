import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';

export const userService = {
    getAll,
    getById,
    createProfile,
    getProfile,
    addExperience,
    deleteExperience,
    updateProfile
};

function createProfile(firstname, lastname, phonenumber, personalwebsite, githublink, bio) {
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/users/profile`, { 'firstname': firstname, 'lastname': lastname, 'phonenumber': phonenumber, 'personalwebsite': personalwebsite, 'githublink': githublink, 'bio': bio}, configOptions)
      .then(response => {
        let currentUser = authenticationService.currentUserValue;
        currentUser.hasProfile = true;
        authenticationService.newCurrentUserValue = currentUser;

      })
      .catch((error)=>Promise.reject(error.response.data.errors));
}

function getProfile(){
  const user = authenticationService.currentUserValue;
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/users/profile/${user.id}`, {headers: authHeader()})
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))

}

function updateProfile(bio, phoneNumber, personalWebsite, github){
  const user = authenticationService.currentUserValue;
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/users/profile/${user.id}`, {'bio': bio, 'phoneNumber': phoneNumber, 'personalWebsite': personalWebsite, 'github':github} ,configOptions)
              .then()
              .catch((error) => Promise.reject(error.response.data.errors))
}

function addExperience(company, title, location, startDate, endDate, description){
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/users/experience`, { 'company': company, 'title': title, 'location': location, 'startDate': startDate, 'endDate': endDate, 'description': description}, configOptions)
      .then()
      .catch((error)=>Promise.reject(error.response.data.errors));
}

function deleteExperience(id){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/users/experience/${id}`, configOptions)
      .then()
      .catch((error)=>Promise.reject(error.response.data.errors));
}

function getAll() {
    return axios.get(`${config.apiUrl}/users`, {headers: authHeader()}).then(result => result.data);
}

function getById(id) {
    return axios.get(`${config.apiUrl}/users/${id}`, {headers: authHeader()}).then(result=> {
    //console.log(result);
  return result.data;
});
}
