const express = require('express');
const router = express.Router();
const authenticationService = require('./authentication.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');
var path = require('path');

router.post('/authenticate', authenticate);
router.post('/register',
            check('email').isEmail().withMessage('Email must be the form jobs@jobs.com'),
            check('username').isLength({min:8}).withMessage('Username must have a minimum of 8 characters'),
            check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'),
            check('usertype').not().isEmpty().withMessage('User type cannot be empty'),
            register);     // public route
module.exports = router;

function authenticate(req, res, next) {
    //console.log(req.body);
    authenticationService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ errors: ['Username or password is incorrect'] }))
        .catch(err => next(err));
}

async function register(req, res, next){
    //console.log(req.body);
    //extract and format results from validationResult
    const {errors} = validationResult(req);
    let errorMessages = errors.map(error => error.msg);
    if(errorMessages.length) {
      res.status(400).json({errors: errorMessages});
      return;
    }

    //check if user/name already exist in DB
    //add user to DB if not exist
    const user = await authenticationService.getByUsernameOrEmail(req.body);
    let newUser;
    if(user.length){
      res.status(400).json({errors: ['Username or email is already taken']});
      return;
    }else{
      try{
        newUser = await authenticationService.register(req.body);
      }catch(error){
        res.status(500).json({errors: ['Internal Server Error']});
      }
    }
    res.json(newUser);
}
