const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');


module.exports = {
    getBusinessProfile,
    addBusinessProfile,
    updateProfile,
    addUpdate,
    deleteUpdate
};

async function getBusinessProfile({id}){
  //console.log(id)
  let profileResults, addressesResults, businessUpdatesResults;
  try{
    profileResults = await pool.query('SELECT email, business_profile.* FROM business_profile, users WHERE business_profile.id = users.id AND business_profile.id = $1', [id]);
    addressesResults = await pool.query('SELECT addresses.* FROM business_profile, business_addresses, addresses WHERE business_profile.id = $1 AND business_profile.id = business_addresses.b_id AND business_addresses.a_id = addresses.id', [id]);
    businessUpdatesResults = await pool.query('SELECT business_updates.update_id, business_updates.content, DATE(business_updates.date_posted) as date_posted FROM business_updates where id = $1 ORDER BY business_updates.date_posted DESC ',[id]);
  }catch(error){
    throw error;
  }

  if(profileResults.rowCount){
    profileResults.rows[0].addresses = addressesResults.rows;
    profileResults.rows[0].updates = businessUpdatesResults.rows;
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

async function updateProfile(userId, {phoneNumber, website, description}){
  try{
    await pool.query('UPDATE business_profile SET phone_number = $1, website = $2, description = $3 WHERE id = $4', [phoneNumber, website, description, userId]);
  }catch(error){
    throw error;
  }
}

async function addUpdate(userId, {content}){
  try{
    await pool.query('INSERT INTO business_updates (update_id, id, content, date_posted) VALUES (DEFAULT, $1, $2, DEFAULT)',[userId, content])
  }catch(error){
    throw error;
  }
}

async function deleteUpdate(userId, updateId){
  try{
    await pool.query('DELETE FROM business_updates WHERE id = $1 AND update_id = $2', [userId, updateId])
  }catch(error){
    throw error;
  }
}
