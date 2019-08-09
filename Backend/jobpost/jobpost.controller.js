const express = require('express');
const router = express.Router();
const jobPostService = require('../otherservices/jobpost.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');

router.get('/', authorize(Role.User),searchJobPost);
router.get('/:id', authorize([Role.User, Role.Business]), getJobPostById);

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

async function getJobPostById(req, res, next){
  try{
    let jobPost = await jobPostService.getJobPost(req.params.id);
    if(req.user.role = Role.User){
      if(await jobPostService.checkUserAppliedForJob(req.user.sub, req.params.id)){
        jobPost.applied = true;
      }else{
        jobPost.applied = false;
      }
    }
    res.json(jobPost);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}
