const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');

module.exports = {
  uploadProfileImage
};

async function uploadProfileImage(userId, userType, encodedString){
  try{
    if(userType === 'USER'){
      await pool.query('UPDATE user_profile SET profile_image_name = $1 WHERE id = $2', [encodedString, userId]);
    }else if(userType === 'BUSINESS'){
      //TODO
    }

  }catch(error){
    throw error;
  }
}
