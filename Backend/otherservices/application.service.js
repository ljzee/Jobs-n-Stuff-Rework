const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');

module.exports = {
  updateApplicationStatus,
};

async function updateApplicationStatus(applicationId, status){
  try{
    var date = new Date();
    await pool.query('UPDATE applications SET status=$1, date_processed=$2 WHERE id=$3', [status, date.toISOString().split('T')[0], applicationId]);
  }catch(error){
    throw error;
  }
}
