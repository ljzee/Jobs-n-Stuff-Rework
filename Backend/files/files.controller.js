const express = require('express');
const router = express.Router();
const fileService = require('./files.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const{check, validationResult} = require('express-validator');
const multer = require('multer')
var fs = require('fs');

//const upload = multer({ dest: `public/` });

router.post('/', authorize(Role.User), uploadFile);
//router.get('/download', authorize(), downloadFile);
router.get('/', authorize(), getAllUserFiles);
router.delete('/:id', authorize(Role.User), deleteFile);
router.put('/:id', authorize(Role.User), updateFile);
router.get('/:id', authorize(), downloadFile);
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



function uploadFile(req, res, next){
  upload(req, res, async function (err) {
    //console.log(req)
     if (err instanceof multer.MulterError) {
         return res.status(500).json(err);
     } else if (err) {
         return res.status(500).json(err);
     } else {
       try{
         await fileService.addFile(req.user.sub, req.file, req.body.fileType, req.body.fileRename)
         res.sendStatus(200);
       }catch(error){
         console.log(error);
         res.status(500).json(error)
       }
     }
  })
}

async function getAllUserFiles(req, res, next){
    try{
      let files = await fileService.getAllUserFiles(req.user.sub)
      res.json(files);
    }catch(error){
      console.log(error);
      res.status(500).json(error);
    }
}

async function deleteFile(req, res, next){
  try{
    await fileService.deleteFile(req.user.sub, req.params.id);
    res.sendStatus(200);
  }catch(error){
    console.log(error);
    res.status(500).json(error);
  }
}

async function updateFile(req, res, next){
  try{
    await fileService.updateFile(req.user.sub, req.params.id, req.body.fileRename);
    res.sendStatus(200);
  }catch(error){
    console.log(error);
    res.status(500).json(error);
  }
}

async function downloadFile(req, res, next){
  try{
    let file = await fileService.getFilePath(req.user.sub, req.params.id, req.body.fileRename);
    if(file){
      res.download(file.file_path, file.file_name, function(err){
        if(err){
          res.status(500).json(err);
        }
      });
    }else{
      res.status(400).json({errors: 'File does not exist'});
    }
  }catch(error){
    console.log(error);
    res.status(500).json(error);
  }
}
