var pool = require('../database');

module.exports = {
  addFile
}

async function addFile(file, fileType, fileRename){

    console.log(file);
    console.log(fileType);
    console.log(fileRename);

    if (fileRename !== ""){}

    let extension = file.originalname.split(/\.(?=[^\.]+$)/);
    /*fs.rename(req.file.path, `${req.file.destination}${req.body.fileRename}.${extension[1]}`, function(err){
      if(err){
        return res.status(500).json(err);
      }else{
        res.sendStatus(200);
      }
    });*/
    let newFileName = `${fileRename}.${extension[1]}`;
}
