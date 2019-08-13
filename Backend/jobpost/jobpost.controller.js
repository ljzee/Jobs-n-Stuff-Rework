const express = require('express');
const router = express.Router();
const jobPostService = require('../otherservices/jobpost.service');
const userService = require('../users/users.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');

router.get('/', authorize(Role.User),searchJobPost);
router.get('/:id', authorize([Role.User, Role.Business]), getJobPostById);

module.exports = router;

//Purpose of this function is to process job results by checking it against a list of jobs.
//The list of jobs may be jobs that user has bookmarked or applied to.
//An named attribute will be added to the job results. It will be given TRUE or FALSE based on if it exists in the list of jobs.
function processSearchedJobs(searchedJobs, jobsToCheckAgainst, attributeName){
  searchedJobs.forEach(job => {
    if(jobsToCheckAgainst.includes(job.id)){
      job[attributeName] = true;
    }else{
      job[attributeName] = false;
    }
  })
}

async function searchJobPost(req, res, next){
  try{
    let jobPosts = await jobPostService.searchJobPost(req.query);
    let userBookmarkedJobs = await userService.getUserBookmarkedJobs(req.user.sub);
    let userAppliedJobs = await userService.getUserAppliedJobs(req.user.sub);
    processSearchedJobs(jobPosts, userBookmarkedJobs.map(job => job.id), 'bookmarked');
    processSearchedJobs(jobPosts, userAppliedJobs.map(job => job.j_id), 'applied');
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
