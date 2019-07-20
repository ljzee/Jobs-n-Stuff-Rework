const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');


module.exports = {
    getUserProfile,
    addUserProfile,
    addExperience,
    deleteExperience,
    updateProfile
};


async function addUserProfile(id, {firstname, lastname, phonenumber, personalwebsite, githublink, bio}){
  let results;
  try{
    results = await pool.query('INSERT INTO user_profile(id, first_name, last_name, phone_number, personal_website, github_link, bio) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [id, firstname, lastname, phonenumber, personalwebsite, githublink, bio]);

  }catch(error){
    throw error;
  }
}

async function addExperience(id, {company, title, location, startDate, endDate, description}){
  if(endDate === '') endDate = null;
  let results;
  try{
    results = await pool.query('INSERT INTO user_experience(experience_id, id, company_name, title, location, start_date, end_date, description) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)', [id, company, title, location, startDate, endDate, description]);
  }catch(error){
    throw error;
  }
}

async function deleteExperience({id}){
  let results;
  try{
    results = await pool.query('DELETE FROM user_experience WHERE experience_id = $1', [id]);
  }catch(error){
    throw error;
  }
}


async function getUserProfile({id}){
  //console.log(id)
  let profile, experiences;
  try{
    profile = await pool.query('SELECT email, user_profile.* FROM user_profile, users WHERE user_profile.id = users.id AND user_profile.id = $1', [id]);
    experiences = await pool.query('SELECT * FROM user_experience WHERE id = $1 ORDER BY end_date DESC', [id]);
  }catch(error){
    throw error;
  }
  if(profile.rowCount){
    profile.rows[0].experiences = experiences.rows;
  }
  return profile.rows;
}

async function updateProfile(id, {bio, phoneNumber, personalWebsite, github}){
  try{
    await pool.query('UPDATE user_profile SET bio = $1, phone_number = $2, personal_website = $3, github_link = $4 WHERE id = $5', [bio, phoneNumber, personalWebsite, github, id]);
  }catch(error){
    throw error;
  }
}
/*
db.query('SELECT NOW()', (err,res)=>{
  if(err.error)
  return console.log(err.error);
  console.log(`PostgreSQL connected: ${res[0].now}`)''
})
*/
