const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');

module.exports = {
  updateApplicationStatus,
  submitApplication,
  getAllUserApplications
};

async function updateApplicationStatus(applicationId, status){
  try{
    var date = new Date();
    await pool.query('UPDATE applications SET status=$1, date_processed=$2 WHERE id=$3', [status, date.toISOString().split('T')[0], applicationId]);
  }catch(error){
    throw error;
  }
}

//DATABASE TRANSACTION
async function submitApplication(userId, {jobPostId, documentIds}){
  try{
    await pool.query('BEGIN');
    const {rows} = await pool.query('INSERT INTO applications(id, status, date_submitted) VALUES (DEFAULT, $1, DEFAULT) RETURNING id', ['NEW']);
    await pool.query('INSERT INTO user_applications(u_id, a_id) VALUES ($1, $2)',[userId, rows[0].id]);
    await pool.query('INSERT INTO job_applications(a_id, j_id) VALUES ($1, $2)', [rows[0].id, jobPostId]);
    for(var i=0; i < documentIds.length; i++ ){
      await pool.query('INSERT INTO application_documents(a_id, d_id) VALUES ($1, $2)', [rows[0].id, documentIds[i]]);
    }
    await pool.query('COMMIT');
  }catch(error){
    await pool.query('ROLLBACK');
    throw error;
  }
}

async function getAllUserApplications(userId){
  try{
    let applicationsQueryResults = await pool.query(`SELECT applications.*, business_profile.company_name, business_profile.id as b_id, job_post.title, job_post.id AS j_id
                                                     FROM user_applications, applications, job_applications, job_post, business_jobs, business_profile
                                                     WHERE user_applications.u_id = $1
                                                           AND user_applications.a_id = applications.id
                                                           AND user_applications.a_id = job_applications.a_id
                                                           AND job_applications.j_id = job_post.id
                                                           AND job_applications.j_id = business_jobs.j_id
                                                           AND business_jobs.b_id = business_profile.id`, [userId]);
     return applicationsQueryResults.rows;
  }catch(error){
    throw error;
  }
}
