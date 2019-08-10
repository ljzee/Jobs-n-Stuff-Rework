const express = require('express');
const router = express.Router();
const applicationService = require('../otherservices/application.service');
const jobPostService = require('../otherservices/jobpost.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');

router.post('/', authorize(Role.User), submitApplication);

async function submitApplication(req, res, next){
  try{
    if(await jobPostService.checkUserAppliedForJob(req.user.sub, req.body.jobPostId)){
      res.status(400).json({errors: ['Cannot submit application']});
    }else{
      await applicationService.submitApplication(req.user.sub, req.body)
      res.sendStatus(200);
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']})
    console.log(error);
  }
}

module.exports = router;
