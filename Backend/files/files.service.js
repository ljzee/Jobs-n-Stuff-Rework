var pool = require('../database');

module.exports = {
  addFile,
  getAllUserFiles,
  deleteFile,
  updateFile,
  getFilePath
}

async function addFile(id, file, fileType, fileRename){

    try{
      let results;
      if (fileRename !== ""){
        let extension = file.originalname.split(/\.(?=[^\.]+$)/);
        let newFileName = `${fileRename}.${extension[1]}`;
        console.log(Math.round(file.size/1000));
        results = await pool.query('INSERT INTO user_documents(id, file_id, file_path, file_name, file_type, file_size, date_uploaded) VALUES ($1, DEFAULT, $2, $3, $4, $5, DEFAULT)', [id, file.path, newFileName, fileType, Math.round(file.size/1000)]);
      }else{
        results = await pool.query('INSERT INTO user_documents(id, file_id, file_path, file_name, file_type, file_size, date_uploaded) VALUES ($1, DEFAULT, $2, $3, $4, $5, DEFAULT)', [id, file.path, file.originalname, fileType, Math.round(file.size/1000)]);
      }

    }catch(error){
      throw error;
    }

    /*fs.rename(req.file.path, `${req.file.destination}${req.body.fileRename}.${extension[1]}`, function(err){
      if(err){
        return res.status(500).json(err);
      }else{
        res.sendStatus(200);
      }
    });*/

}

async function deleteFile(userId, fileId){
  try{
    await pool.query('DELETE FROM user_documents WHERE id = $1 AND file_id = $2', [userId, fileId]);
    console.log(userId + ' ' + fileId);
  }catch(error){
    throw error;
  }
}

async function getAllUserFiles(userId){
  try{
    let results = await pool.query('SELECT file_id, file_name, file_type, file_size, date_uploaded FROM user_documents WHERE id = $1', [userId]);
    return results.rows;
  }catch(error){
    throw error;
  }
}

async function updateFile(userId, fileId, fileRename){
  try{
    let results = await pool.query('SELECT file_name FROM user_documents WHERE id = $1 AND file_id = $2', [userId, fileId]);
    if(results.rowCount){
      let extension = results.rows[0].file_name.split(/\.(?=[^\.]+$)/);
      let newFileName = `${fileRename}.${extension[1]}`;
      await pool.query('UPDATE user_documents SET file_name = $1 WHERE id = $2 AND file_id = $3', [newFileName, userId, fileId]);
    }
    //console.log(results);
  }catch(error){
    throw error;
  }
}

async function getFilePath(userId, fileId){
  try{
     results = await pool.query('SELECT file_path, file_name FROM user_documents WHERE id = $1 AND file_id = $2', [userId, fileId]);
     if(results.rowCount){
       return results.rows[0];
     }
  }catch(error){
    throw error;
  }
}
