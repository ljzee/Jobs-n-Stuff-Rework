const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');


module.exports = {
    getBusinessProfile,
    addBusinessProfile,
    addJobPost,
    getAllBusinessJobPost,
};

async function getBusinessProfile({id}){
  //console.log(id)
  let profileResults, addressesResults;
  try{
    profileResults = await pool.query('SELECT email, business_profile.* FROM business_profile, users WHERE business_profile.id = users.id AND business_profile.id = $1', [id]);
    addressesResults = await pool.query('SELECT addresses.* FROM business_profile, business_addresses, addresses WHERE business_profile.id = $1 AND business_profile.id = business_addresses.b_id AND business_addresses.a_id = addresses.id', [id])
  }catch(error){
    throw error;
  }

  if(profileResults.rowCount){
    profileResults.rows[0].addresses = addressesResults.rows;
    return profileResults.rows[0];
  }
  return null;
}

async function addBusinessProfile(id, {companyName, country, state, city, streetAddress, postalCode, phoneNumber, website, description}){
  let businessQueryResults, addressQueryResults;
  try{
    businessQueryResults = await pool.query('INSERT INTO business_profile(id, company_name, description, website, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id', [id, companyName, description, website, phoneNumber]);
    addressQueryResults = await pool.query('INSERT INTO addresses(id, street_name_no, city, state, country, postal_code) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING id', [streetAddress, city, state, country, postalCode]);
    if(businessQueryResults.rows.length && addressQueryResults.rows.length){
      await pool.query('INSERT INTO business_addresses(b_id, a_id) VALUES ($1, $2)', [businessQueryResults.rows[0].id, addressQueryResults.rows[0].id])
    }

  }catch(error){
    throw error;
  }
}

async function addJobPost(id, {
                jobTitle,
                duration,
                positionType,
                location,
                openings,
                jobDescription,
                salary,
                deadline,
                resumeRequired,
                coverletterRequired,
                otherRequired,
                status
              }){
                try{
                  let jobPostQueryResults = await pool.query('INSERT INTO job_post(id, title, duration, position_type, openings, description, salary, deadline, coverletter_required, resume_required, other_required, date_created, status) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, DEFAULT,$11) RETURNING id',
                                                          [jobTitle, duration, positionType, openings, jobDescription, salary, deadline, coverletterRequired, resumeRequired, otherRequired, status])
                  if(jobPostQueryResults.rows.length){
                    let jobId = jobPostQueryResults.rows[0].id;
                    await pool.query('INSERT INTO business_jobs (b_id, j_id) VALUES ($1, $2)',[id, jobId]);
                    await pool.query('INSERT INTO job_addresses (j_id, a_id) VALUES ($1, $2)', [jobId, location]);
                  }

                }catch(error){
                  throw error;
                }

              }

  async function getAllBusinessJobPost(id){
    try{
      let jobPostQueryResults = await pool.query('SELECT job_post.*, addresses.street_name_no, addresses.city, addresses.state, addresses.country, addresses.postal_code FROM business_jobs, job_post, job_addresses, addresses WHERE business_jobs.b_id = $1 AND business_jobs.j_id = job_post.id AND job_post.id = job_addresses.j_id AND job_addresses.a_id = addresses.id', [id]);

      return jobPostQueryResults.rows;
    }catch(error){
      throw error;
    }
  }
