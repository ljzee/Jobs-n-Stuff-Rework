const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');


module.exports = {
    getUserProfile,
    addUserProfile,
    addExperience,
    editExperience,
    deleteExperience,
    updateProfile,
    addBookmark,
    removeBookmark,
    getUserBookmarkedJobs,
    getUserAppliedJobs
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

async function editExperience(userId, experienceId, {company, title, location, startDate, endDate, description}){
  if(endDate === '') endDate = null;
  let results;
  try{
    results = await pool.query('Update user_experience SET company_name=$1, title=$2, location=$3, start_date=$4, end_date=$5, description=$6 WHERE id=$7 AND experience_id=$8', [company, title, location, startDate, endDate, description, userId, experienceId]);
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

async function addBookmark(userId, jobId){
  try{
    await pool.query('INSERT INTO user_bookmarks (u_id, j_id) VALUES ($1, $2)', [userId, jobId]);
  }catch(error){
    throw error;
  }
}

async function removeBookmark(userId, jobId){
  try{
    await pool.query('DELETE FROM user_bookmarks WHERE u_id = $1 AND j_id = $2', [userId, jobId]);
  }catch(error){
    throw error;
  }
}

async function getUserBookmarkedJobs(userId){
  try{
    let bookmarkQueryResults;
    bookmarkQueryResults = await pool.query(`SELECT job_post.id, job_post.title, business_profile.company_name, business_profile.id as b_id
                                             FROM user_bookmarks, job_post, business_jobs, business_profile
                                             WHERE job_post.id = user_bookmarks.j_id
	                                                 AND job_post.id = business_jobs.j_id
	                                                 AND business_jobs.b_id = business_profile.id
                                                   AND user_bookmarks.u_id = $1;`, [userId]);
    return bookmarkQueryResults.rows;
  }catch(error){
    throw error;
  }
}

async function getUserAppliedJobs(userId){
  try{
    let jobPostQueryResults;
    jobPostQueryResults = await pool.query(`SELECT job_applications.j_id
                                            FROM user_applications, job_applications
                                            WHERE user_applications.u_id = $1 AND user_applications.a_id = job_applications.a_id;`, [userId]);
    return jobPostQueryResults.rows;
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
