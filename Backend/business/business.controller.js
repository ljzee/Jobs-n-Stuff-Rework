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

async function createProfile(req, res, next){
  const {errors} = validationResult(req);
  let errorMessages = errors.map(error => error.msg);
  if(errorMessages.length) {
    res.status(400).json({errors: errorMessages});
    return;
  }

  try{
    const profile = await businessService.getBusinessProfile({id: req.user.sub});
    if(profile.length){
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
    if(profile.length){
      res.json(profile[0]);
    }else{
      res.status(400).json({errors: 'Profile does not exist'});
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
  }
}

module.exports = router;
