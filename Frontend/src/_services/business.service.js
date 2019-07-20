import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';

export const businessService = {
    createProfile,
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
