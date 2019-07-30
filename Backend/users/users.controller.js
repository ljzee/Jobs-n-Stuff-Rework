const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');
var path = require('path');

// routes
router.get('/profile/:id', getProfileById);
router.post('/profile',
             check('firstname').not().isEmpty().withMessage('First name cannot be empty'),
             check('lastname').not().isEmpty().withMessage('Last name cannot be empty'),
             authorize(Role.User),
             createProfile);
router.post('/experience',
             check('company').not().isEmpty().withMessage('Company name cannot be empty'),
             check('title').not().isEmpty().withMessage('Title cannot be empty'),
             check('location').not().isEmpty().withMessage('Location cannot be empty'),
             check('startDate').not().isEmpty().withMessage('Duration cannot be empty'),
             authorize(Role.User),
             addExperience);
router.delete('/experience/:id', authorize(Role.User), deleteExperience);
router.get('/profile/profile-image/:name', getProfileImage);
router.put('/profile/:id', authorize(Role.User), updateProfile);
//router.get('/', authorize(Role.Admin), getAll); // admin only
//router.get('/:id', authorize(), getById);       // all authenticated users
module.exports = router;


async function createProfile(req, res, next){

  const {errors} = validationResult(req);
  let errorMessages = errors.map(error => error.msg);
  if(errorMessages.length) {
    res.status(400).json({errors: errorMessages});
    return;
  }

  try{
    const profile = await userService.getUserProfile({id: req.user.sub});
    if(profile.length){
      res.status(400).json({errors: ['A profile has already been created for this user']});
      return;
    }else{
        await userService.addUserProfile(req.user.sub, req.body);
        res.sendStatus(200);
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }

}

async function addExperience(req, res, next){
  const {errors} = validationResult(req);
  let errorMessages = errors.map(error => error.msg);
  if(errorMessages.length) {
    res.status(400).json({errors: errorMessages});
    console.log(errorMessages)
    return;
  }

  try{
    const profile = await userService.getUserProfile({id: req.user.sub});
    if(!profile.length){
      res.status(400).json({errors: ['Cannot add experience for a user that does not exist']});
      return;
    }else{
      await userService.addExperience(req.user.sub, req.body);
      res.sendStatus(200);
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
    console.log(error);
  }
}

async function deleteExperience(req, res, next){
  try{
    await userService.deleteExperience(req.params)
    res.sendStatus(200);
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']})
    console.log(error);
  }
}

async function getProfileById(req, res, next){
  try{
    const profile = await userService.getUserProfile(req.params);
    if(profile.length){
      res.json(profile[0]);
    }else{
      res.status(400).json({errors: ['Profile does not exist']});
    }
  }catch(error){
    res.status(500).json({errors: ['Internal Server Error']});
  }
}

async function getProfileImage(req, res, next){
  try{
    var options = {
      root: path.join(__dirname, '../public/profileimages')
    }

    res.status(200);
    res.sendFile(req.params.name, options, function(err){
      if(err){
        console.log(err);
        res.sendStatus(400);
      }
    })
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
}

async function updateProfile(req, res, next){
  try{
    await userService.updateProfile(req.user.sub, req.body);
    res.sendStatus(200);
  }catch(error){
    console.log(error);
    res.status(500).json({errors: ['Internal Server Error']});
  }
}

//demo functions
/*
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
*/
