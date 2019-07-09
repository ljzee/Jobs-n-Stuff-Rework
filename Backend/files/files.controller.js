const express = require('express');
const router = express.Router();
const fileService = require('./files.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');
const multer = require('multer')
var fs = require('fs');

//const upload = multer({ dest: `public/` });

router.post('/upload', uploadFile);
module.exports = router;


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/documents/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname )
    }
})


//const upload = multer({ dest: `${UPLOAD_PATH}/` })

var upload = multer({ storage: storage }).single('file');

router.post('/upload',uploadFile);


function uploadFile(req, res, next){
  upload(req, res, function (err) {
    console.log(req)
     if (err instanceof multer.MulterError) {
         return res.status(500).json(err);
     } else if (err) {
         return res.status(500).json(err);
     } else {
       fileService.addFile(req.file, req.body.fileType, req.body.fileRename);

        res.sendStatus(200);
     }
  })
}
