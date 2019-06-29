const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');

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
    getByUsernameOrEmail
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function register({username, email, password, usertype}) {
  let results;
  try{
    //BCRYPT HERE BEFORE INSERTING
    results = await pool.query('INSERT INTO users(id, username, email, passhash, role) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id', [username, email, password, usertype]);
    if(results.rows.length){
      const token = jwt.sign({sub: results.rows[0].id, role: usertype}, config.secret);
    }
  }catch(error){
    throw error;
  }
  return results;
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
/*
db.query('SELECT NOW()', (err,res)=>{
  if(err.error)
  return console.log(err.error);
  console.log(`PostgreSQL connected: ${res[0].now}`)''
})
*/
