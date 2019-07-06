const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
];

module.exports = {
    authenticate,
    register,
    getAll,
    getById,
    getByUsernameOrEmail,
    getUserProfile,
    addUserProfile
};

async function authenticate({ username, password }) {

    let results, token;
    try{
      results = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
      if(results.rows.length){
        const correctPass = await bcrypt.compare(password, results.rows[0].passhash);
        if(correctPass){
          token = jwt.sign({sub: results.rows[0].id, role: results.rows[0].role}, config.secret);
          let userProfile
          if(results.rows[0].role === 'USER'){
            userProfile = await pool.query('SELECT * FROM user_profile WHERE id = $1', [results.rows[0].id]);
          }
          return{
            id: results.rows[0].id,
            username: results.rows[0].username,
            email: results.rows[0].email,
            role: results.rows[0].role,
            token: token,
            hasProfile: Boolean(userProfile.rowCount)
          }
        }
      }
    }catch(error){
      throw error;
    }

    /*
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
    */
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

async function addUserProfile(id, {firstname, lastname, phonenumber, personalwebsite, githublink, bio}){
  try{
    results = await pool.query('INSERT INTO user_profile(id, first_name, last_name, phone_number, personal_website, github_link, bio) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [id, firstname, lastname, phonenumber, personalwebsite, githublink, bio]);
    if(results.rows.length){

    }
  }catch(error){
    throw error;
  }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
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

async function getUserProfile({id}){
  let results;
  try{
    results = await pool.query('SELECT email, user_profile.* FROM user_profile, users WHERE user_profile.id = users.id AND user_profile.id = $1', [id])
  }catch(error){
    throw error;
  }
  return results.rows;
}
/*
db.query('SELECT NOW()', (err,res)=>{
  if(err.error)
  return console.log(err.error);
  console.log(`PostgreSQL connected: ${res[0].now}`)''
})
*/
