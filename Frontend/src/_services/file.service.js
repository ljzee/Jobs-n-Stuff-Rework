import config from 'config';
import { authHeader} from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';


export const fileService = {
  uploadFile
};

function uploadFile(file, fileType, fileRename){
  const configOptions = {
      headers: authHeader()
  };


  const data = new FormData();
  data.append('file', file);
  data.append('fileType', fileType);
  data.append('fileRename', fileRename);

  return axios.post(`${config.apiUrl}/files/upload`, data, configOptions)
              .then(res=>{
                console.log(res.statusText)
              })
              .catch((error) => Promise.reject(error))
}
