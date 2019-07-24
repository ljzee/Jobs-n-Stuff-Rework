const express = require('express');
const router = express.Router();
const businessService = require('./business.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');
var path = require('path');

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
      res.status(400).json({errors: 'Profile does not exist'});
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
    await businessService.addJobPost(req.user.sub, req.body);
    res.sendStatus(200);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

async function getAllBusinessJobPost(req, res, next){
  try{
    let businessJobPosts = await businessService.getAllBusinessJobPost(req.user.sub);
    res.json(businessJobPosts);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

module.exports = router;
