const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
const JobPostStatus = require('_helpers/jobpoststatus');
var pool = require('../database');
const bcrypt = require('bcrypt');

module.exports = {
    addJobPost,
    getAllBusinessJobPost,
    deleteJobPost,
    checkHasJobPost,
    updateJobPost,
    updateJobPostStatus,
    getJobPost,
    getAllJobApplicants,
    searchJobPost,
    checkUserAppliedForJob
};

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

//'SELECT job_post.*, addresses.street_name_no, addresses.city, addresses.state, addresses.country, addresses.postal_code FROM business_jobs, job_post, job_addresses, addresses WHERE business_jobs.b_id = $1 AND business_jobs.j_id = job_post.id AND job_post.id = job_addresses.j_id AND job_addresses.a_id = addresses.id'

async function getAllBusinessJobPost(id){
  try{
    let jobPostQueryResults = await pool.query(`SELECT job_post.*,
                                                       addresses.street_name_no,
                                                       addresses.city,
                                                       addresses.state,
                                                       addresses.country,
                                                       addresses.postal_code,
                                                       count_table.count
                                                 FROM business_jobs,
                                                      job_post, job_addresses,
                                                      addresses,
                                                      (SELECT job_post.id as j_id, COALESCE(COUNT(job_applications.a_id),0) as count
                                                       FROM job_post LEFT OUTER JOIN job_applications ON job_post.id = job_applications.j_id
                                                       GROUP BY job_post.id) AS count_table
                                                 WHERE business_jobs.b_id = $1
                                                      AND business_jobs.j_id = job_post.id
                                                      AND job_post.id = job_addresses.j_id
                                                      AND job_addresses.a_id = addresses.id
                                                      AND job_post.id = count_table.j_id`, [id]);

    return jobPostQueryResults.rows;
  }catch(error){
    throw error;
  }
}

async function getJobPost(jobPostId){
  try{
    let jobPostQueryResults = await pool.query('SELECT business_profile.id AS b_id, business_profile.company_name, business_profile.website, business_profile.phone_number, job_post.*, job_addresses.a_id FROM job_post, business_jobs, business_profile, job_addresses WHERE job_post.id = $1 AND job_post.id = job_addresses.j_id AND job_post.id = business_jobs.j_id AND business_jobs.b_id = business_profile.id;', [jobPostId])
    if(jobPostQueryResults.rows.length){
      let addressesResults = await pool.query('SELECT addresses.* FROM business_profile, business_addresses, addresses WHERE business_profile.id = $1 AND business_profile.id = business_addresses.b_id AND business_addresses.a_id = addresses.id', [jobPostQueryResults.rows[0].b_id]);
      jobPostQueryResults.rows[0].addresses = addressesResults.rows;
    }
    return jobPostQueryResults.rows[0];
  }catch(error){
    throw error;
  }
}

async function checkHasJobPost(userId, jobPostId){
  try{
    let businessJobQueryResults = await pool.query('SELECT * FROM business_jobs WHERE b_id = $1 AND j_id = $2', [userId, jobPostId]);
    return businessJobQueryResults.rows.length;
  }catch(error){
    throw error;
  }
}

async function updateJobPost(userId, jobPostId, {
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
                otherRequired
              }){
                try{
                  await pool.query('UPDATE job_post SET title = $1, duration = $2, position_type = $3, openings = $4, description = $5, salary = $6, deadline = $7, coverletter_required = $8, resume_required = $9, other_required = $10 WHERE id = $11',
                                   [jobTitle, duration, positionType, openings, jobDescription, salary, deadline, coverletterRequired, resumeRequired, otherRequired, jobPostId]);
                  await pool.query('UPDATE job_addresses SET a_id = $1 WHERE j_id = $2', [location, jobPostId]);
                }catch(error){
                  throw error;
                }
              }

async function updateJobPostStatus(jobPostId, {status}){
  try{
    if(status === JobPostStatus.Open){
      await pool.query('UPDATE job_post SET status = $1, date_published = CURRENT_DATE WHERE id = $2', [status, jobPostId]);
    }else{
      await pool.query('UPDATE job_post SET status = $1 WHERE id = $2', [status, jobPostId]);
    }
  }catch(error){
    throw error;
  }
}

async function deleteJobPost(userId, jobPostId){
  try{
    await pool.query('UPDATE job_post SET status = $1 WHERE id = $2', ['CLOSED', jobPostId]);
    await pool.query('DELETE FROM business_jobs WHERE b_id = $1 AND j_id = $2', [userId, jobPostId]);
  }catch(error){
    throw error;
  }
}

async function getAllJobApplicants(jobPostId){
  try{
    let jobPostApplicantsQueryResults = await pool.query('SELECT applications.id as a_id, applications.date_processed, user_profile.id, user_profile.profile_image_name, user_profile.first_name, user_profile.last_name, user_profile.phone_number, users.email, applications.status FROM users, user_profile, user_applications, job_applications, applications WHERE users.id = user_profile.id AND user_profile.id = user_applications.u_id AND user_applications.a_id = job_applications.a_id AND job_applications.a_id = applications.id AND job_applications.j_id = $1',
                                              [jobPostId]);
    return jobPostApplicantsQueryResults.rows;
  }catch(error){
    throw error;
  }
}

async function searchJobPost({searchField, country, state, city}){
  try{
    let jobPostQueryResults = await pool.query(`
      (SELECT job_post.id, job_post.title, job_post.position_type, job_post.date_published, job_post.description, business_profile.company_name, addresses.city, addresses.state
       FROM job_post, business_jobs, business_profile, job_addresses, addresses
       WHERE job_post.id = business_jobs.j_id AND business_jobs.b_id = business_profile.id AND job_post.id = job_addresses.j_id AND job_addresses.a_id = addresses.id AND job_post.id IN (SELECT job_addresses.j_id
                                                                                                                                                                                          FROM job_addresses
                                                                                                                                                                                          WHERE j_id IN (SELECT job_post.id as j_id FROM job_post WHERE title ILIKE $1 AND status='OPEN')
                                                                                                                                                                                          AND a_id IN (SELECT addresses.id as a_id FROM addresses WHERE country ILIKE $2 AND state ILIKE $3 AND city ILIKE $4)
                                                                                                                                                                                          )
      )
      UNION
      (SELECT job_post.id, job_post.title, job_post.position_type, job_post.date_published, job_post.description, business_profile.company_name, addresses.city, addresses.state
       FROM job_post, business_jobs, business_profile, job_addresses, addresses
       WHERE job_post.id = business_jobs.j_id AND business_jobs.b_id = business_profile.id AND job_post.id = job_addresses.j_id AND job_addresses.a_id = addresses.id AND job_post.status='OPEN' AND job_addresses.a_id IN (SELECT business_addresses.a_id
                                                                                                                                                                                                                            FROM business_addresses
                                                                                                                                                                                                                            WHERE b_id IN (SELECT business_profile.id as b_id FROM business_profile WHERE company_name ILIKE $1)
                                                                                                                                                                                                                            AND a_id IN (SELECT addresses.id as a_id FROM addresses WHERE country ILIKE $2 AND state ILIKE $3 AND city ILIKE $4)
                                                                                                                                                                                                                            )
      )
    `, [`%${searchField}%`,
        `%${country}%`,
        `%${state}%`,
        `%${city}%`])

    return jobPostQueryResults.rows;
  }catch(error){
    throw error;
  }
}

async function checkUserAppliedForJob(userId, jobPostId){
  try{
    let result = await pool.query('SELECT * FROM user_applications, job_applications WHERE user_applications.u_id = $1 AND user_applications.a_id = job_applications.a_id AND job_applications.j_id = $2', [userId, jobPostId]);
    return result.rows.length;
  }catch(error){
    throw error;
  }
}
