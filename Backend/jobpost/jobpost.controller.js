const express = require('express');
const router = express.Router();
const jobPostService = require('../otherservices/jobpost.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');

router.get('/', authorize(Role.User),searchJobPost);

module.exports = router;

async function searchJobPost(req, res, next){
  try{
    let jobPosts = await jobPostService.searchJobPost(req.query);
    res.json(jobPosts);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']})
    console.log(error);
  }
}
