const express = require('express');
const router = express.Router();
const businessService = require('./business.service');
const jobPostService = require('../otherservices/jobpost.service');
const fileService = require('../files/files.service');
const authorize = require('_helpers/authorize');
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');
var path = require('path');
var zip = require('express-zip');

router.post('/profile',
            check('companyName').not().isEmpty().withMessage('Company name cannot be empty'),
            check('country').not().isEmpty().withMessage('Country cannot be empty'),
            check('state').not().isEmpty().withMessage('State cannot be empty'),
            check('city').not().isEmpty().withMessage('City cannot be empty'),
            check('postalCode').not().isEmpty().withMessage('Postal code cannot be empty'),
            check('streetAddress').not().isEmpty().withMessage('Street Address cannot be empty'),
            authorize(Role.Business),
            createProfile);
router.get('/profile/:id', getProfileById);

router.post('/jobpost',
            check('jobTitle').not().isEmpty().withMessage('Job title cannot be empty'),
            check('duration').not().isEmpty().withMessage('Duration cannot be empty'),
            check('positionType').not().isEmpty().withMessage('Position type cannot be empty'),
            check('location').not().isEmpty().withMessage('Location cannot be empty'),
            check('openings').not().isEmpty().withMessage('Number of openings cannot be empty'),
            check('resumeRequired').not().isEmpty().withMessage('Resume required cannot be empty'),
            check('coverletterRequired').not().isEmpty().withMessage('Cover letter required cannot be empty'),
            check('otherRequired').not().isEmpty().withMessage('Other required cannot be empty'),
            check('status').not().isEmpty().withMessage('Posting type cannot be empty'),
            authorize(Role.Business),
            addJobPost);

router.get('/jobpost',
            authorize(Role.Business),
            getAllBusinessJobPost)
router.get('/jobpost/:id',
            authorize(Role.Business),
            getJobPostById)
router.put('/jobpost/:id',
            check('jobTitle').not().isEmpty().withMessage('Job title cannot be empty'),
            check('duration').not().isEmpty().withMessage('Duration cannot be empty'),
            check('positionType').not().isEmpty().withMessage('Position type cannot be empty'),
            check('location').not().isEmpty().withMessage('Location cannot be empty'),
            check('openings').not().isEmpty().withMessage('Number of openings cannot be empty'),
            check('resumeRequired').not().isEmpty().withMessage('Resume required cannot be empty'),
            check('coverletterRequired').not().isEmpty().withMessage('Cover letter required cannot be empty'),
            check('otherRequired').not().isEmpty().withMessage('Other required cannot be empty'),
            authorize(Role.Business),
            updateJobPost)
router.delete('/jobpost/:id',
              authorize(Role.Business),
              deleteJobPost)

router.get('/jobpost/:id/applicants', authorize(Role.Business), getAllJobApplicants)
router.get('/jobpost/:id/applicants/:applicationid', authorize(Role.Business), getApplicationFiles)

async function createProfile(req, res, next){
  const {errors} = validationResult(req);
  let errorMessages = errors.map(error => error.msg);
  if(errorMessages.length) {
    res.status(400).json({errors: errorMessages});
    return;
  }

  try{
    const profile = await businessService.getBusinessProfile({id: req.user.sub});
    if(profile){
      res.status(400).json({errors: ['A profile has already been created for this user']});
      return;
    }else{
        await businessService.addBusinessProfile(req.user.sub, req.body);
        res.sendStatus(200);
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }

}

async function getProfileById(req, res, next){
  try{
    const profile = await businessService.getBusinessProfile(req.params);
    if(profile){
      res.json(profile);
    }else{
      res.status(400).json({errors: ['Profile does not exist']});
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error)
  }
}

async function addJobPost(req, res, next){
  const {errors} = validationResult(req);
  let errorMessages = errors.map(error => error.msg);
  if(errorMessages.length) {
    res.status(400).json({errors: errorMessages});
    return;
  }
  try{
    await jobPostService.addJobPost(req.user.sub, req.body);
    res.sendStatus(200);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

async function getAllBusinessJobPost(req, res, next){
  try{
    let businessJobPosts = await jobPostService.getAllBusinessJobPost(req.user.sub);
    res.json(businessJobPosts);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

async function getJobPostById(req, res, next){
  try{
    let businessJobPost = await jobPostService.getJobPost(req.params.id);
    res.json(businessJobPost);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

async function updateJobPost(req, res, next){
  const {errors} = validationResult(req);
  let errorMessages = errors.map(error => error.msg);
  if(errorMessages.length) {
    res.status(400).json({errors: errorMessages});
    return;
  }
  try{
    //CHECK AUTHORIZATION/OWNERSHIP PRIOR TO MODIFYING A JOB POST
    let hasJobPost = await jobPostService.checkHasJobPost(req.user.sub, req.params.id);
    if(hasJobPost){
      await jobPostService.updateJobPost(req.user.sub, req.params.id, req.body);
      res.sendStatus(200);
    }else{
      res.status(401).json({errors: ['Unauthorized']});
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }

}

async function deleteJobPost(req, res, next){
  try{
    await jobPostService.deleteJobPost(req.user.sub, req.params.id);
    res.sendStatus(200);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

async function getAllJobApplicants(req, res, next){
  try{
    let hasJobPost = await jobPostService.checkHasJobPost(req.user.sub, req.params.id);
    if(hasJobPost){
      let applicants = await jobPostService.getAllJobApplicants(req.params.id);
      res.json({applicants: applicants})
    }else{
      res.status(400).json({errors: ['Job post does not exist']})
    }
  }catch(error){

  }
}

async function getApplicationFiles(req, res, next){
  let hasJobPost = await jobPostService.checkHasJobPost(req.user.sub, req.params.id);
  if(hasJobPost){
    let applicationFiles = await fileService.getApplicationFiles(req.params.applicationid);
    let packageName = await fileService.getApplicationFilesPackageName(req.params.applicationid, req.params.id);
    res.zip(applicationFiles.map(file=>({path: file.file_path, name: file.file_name})), packageName, function(err){
      if(err){
        res.status(500).json({errors: [err]});
      }
    })
  }else{
    res.status(400).json({errors: ['Unauthorized']})
  }
}

module.exports = router;
