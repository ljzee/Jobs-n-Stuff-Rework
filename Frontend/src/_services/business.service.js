import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';

export const businessService = {
    createProfile,
    getProfile,
    addJobPost,
    getAllBusinessJobPost,
    getJobPost,
    updateJobPost,
    deleteJobPost
};

function createProfile(companyName, country, state, city, streetAddress, postalCode, phoneNumber, website, description) {
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/business/profile`, {
        'companyName' : companyName,
        'country': country,
        'state': state,
        'city': city,
        'streetAddress': streetAddress,
        'phoneNumber': phoneNumber,
        'website': website,
        'description': description,
        'postalCode': postalCode
      }, configOptions)
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
  return axios.get(`${config.apiUrl}/business/profile/${user.id}`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))

}

function addJobPost(jobTitle, duration, positionType, location, openings, jobDescription, salary, deadline, resumeRequired, coverletterRequired, otherRequired, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/jobpost`, {jobTitle: jobTitle, duration: duration, positionType: positionType, location: location, openings: openings, jobDescription: jobDescription, salary: salary, deadline: deadline, resumeRequired: resumeRequired, coverletterRequired: coverletterRequired, otherRequired: otherRequired, status: status}, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function getAllBusinessJobPost(){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function getJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost/${jobPostId}`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function updateJobPost(jobPostId, jobTitle, duration, positionType, location, openings, jobDescription, salary, deadline, resumeRequired, coverletterRequired, otherRequired){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}`, {jobTitle: jobTitle, duration: duration, positionType: positionType, location: location, openings: openings, jobDescription: jobDescription, salary: salary, deadline: deadline, resumeRequired: resumeRequired, coverletterRequired: coverletterRequired, otherRequired: otherRequired}, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function deleteJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/business/jobpost/${jobPostId}`, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}
