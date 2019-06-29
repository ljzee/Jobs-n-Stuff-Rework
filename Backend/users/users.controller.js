const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');

// routes
router.post('/authenticate', authenticate);
router.post('/register',
            check('email').isEmail().withMessage('Email must be the form jobs@jobs.com'),
            check('username').isLength({min:8}).withMessage('Username must have a minimum of 8 characters'),
            check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'),
            check('usertype').not().isEmpty().withMessage('User type cannot be empty'),
            register);     // public route
router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', authorize(), getById);       // all authenticated users
module.exports = router;

function authenticate(req, res, next) {
    console.log(req.body);
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
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
    const user = await userService.getByUsernameOrEmail(req.body);
    if(user.length){
      res.status(400).json({errors: 'Username or email is already taken'});
      return;
    }else{
      const newUser = await userService.register(req.body);
      console.log(newUser);
    }

    //add user to DB if not exist

    //return user information
    res.json({message: "Everything is fine"});
}

/*
userService.getByUsernameOrEmail(req.body, (err,res)=>{
  if(err.error) {
     console.log(err);
  }
  if(res.length){
    console.log('Username is taken');
  }else{
    console.log('Preparing to add user into db');
  }
});
*/

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
