const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');

module.exports = {
    authenticate,
    register,
    getByUsernameOrEmail
};

async function authenticate({ username, password }) {

    let results, token;
    try{
      results = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
      if(results.rows.length){
        const correctPass = await bcrypt.compare(password, results.rows[0].passhash);
        if(correctPass){
          token = jwt.sign({sub: results.rows[0].id, role: results.rows[0].role}, config.secret);
          let profile;
          if(results.rows[0].role === 'USER'){
            profile = await pool.query('SELECT * FROM user_profile WHERE id = $1', [results.rows[0].id]);
          }
          if(results.rows[0].role === 'BUSINESS'){
            profile = await pool.query('SELECT * FROM business_profile WHERE id = $1', [results.rows[0].id]);
          }
          return{
            id: results.rows[0].id,
            username: results.rows[0].username,
            email: results.rows[0].email,
            role: results.rows[0].role,
            token: token,
            hasProfile: Boolean(profile.rowCount)
          }
        }
      }
    }catch(error){
      throw error;
    }

}

async function register({username, email, password, usertype}) {
  let results, hashPass, token;
  try{
    hashPass = await bcrypt.hash(password, 10);
    results = await pool.query('INSERT INTO users(id, username, email, passhash, role) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id', [username, email, hashPass, usertype]);
    if(results.rows.length){
      token = jwt.sign({sub: results.rows[0].id, role: usertype}, config.secret);
    }
  }catch(error){
    throw error;
  }
  return {
    id: results.rows[0].id,
    username: username,
    email: email,
    role: usertype,
    token: token,
    hasProfile: false
  };
}

async function getByUsernameOrEmail({username, email}, cb){
  let results;
  try{
    results = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])
  }catch(error){
    throw error;
  }
  return results.rows;
}
