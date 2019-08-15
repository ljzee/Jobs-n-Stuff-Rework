var pool = require('../database');

module.exports = {
  addFile,
  getAllUserFiles,
  deleteFile,
  updateFile,
  getFilePath,
  getApplicationFiles,
  getApplicationFilesPackageName
}

async function addFile(id, file, fileType, fileRename){

    try{
      let documentQueryResults;
      if (fileRename !== ""){
        let extension = file.originalname.split(/\.(?=[^\.]+$)/);
        let newFileName = `${fileRename}.${extension[1]}`;
        //console.log(Math.round(file.size/1000));
        documentQueryResults = await pool.query('INSERT INTO documents(id, file_path, file_name, file_type, file_size, date_uploaded) VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT) RETURNING id', [file.path, newFileName, fileType, Math.round(file.size/1000)]);
      }else{
        documentQueryResults = await pool.query('INSERT INTO documents(id, file_path, file_name, file_type, file_size, date_uploaded) VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT) RETURNING id', [file.path, file.originalname, fileType, Math.round(file.size/1000)]);
      }

      if(documentQueryResults.rows.length){
        await pool.query('INSERT INTO user_documents(u_id, d_id) VALUES ($1, $2)', [id, documentQueryResults.rows[0].id])
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
    await pool.query('DELETE FROM user_documents WHERE u_id = $1 AND d_id = $2', [userId, fileId]);
    //console.log(userId + ' ' + fileId);
  }catch(error){
    throw error;
  }
}

async function getAllUserFiles(userId){
  try{
    let results = await pool.query('SELECT documents.id AS file_id, documents.file_name, documents.file_type, documents.file_size, documents.date_uploaded FROM user_documents, documents WHERE user_documents.u_id = $1 AND user_documents.d_id = documents.id ORDER BY file_id DESC', [userId]);
    return results.rows;
  }catch(error){
    throw error;
  }
}

async function updateFile(userId, fileId, fileRename){
  try{
    let results = await pool.query('SELECT documents.file_name FROM user_documents, documents WHERE user_documents.u_id = $1 AND user_documents.d_id = $2 AND user_documents.d_id = documents.id', [userId, fileId]);
    if(results.rowCount){
      let extension = results.rows[0].file_name.split(/\.(?=[^\.]+$)/);
      let newFileName = `${fileRename}.${extension[1]}`;
      await pool.query('UPDATE documents SET file_name = $1 WHERE id = $2', [newFileName, fileId]);
    }
    //console.log(results);
  }catch(error){
    throw error;
  }
}

async function getFilePath(userId, fileId){
  try{
     let results = await pool.query('SELECT documents.file_path, documents.file_name FROM user_documents, documents WHERE user_documents.u_id = $1 AND user_documents.d_id = $2 AND user_documents.d_id = documents.id', [userId, fileId]);
     if(results.rowCount){
       return results.rows[0];
     }
  }catch(error){
    throw error;
  }
}


async function getApplicationFiles(applicationId){
  try{
    let results = await pool.query('SELECT documents.file_path, documents.file_name FROM application_documents, documents WHERE application_documents.a_id = $1 AND application_documents.d_id = documents.id',[applicationId]);
    return results.rows;
  }catch(error){
    throw error;
  }
}

async function getApplicationFilesPackageName(applicantId, jobId){
  try{
    let userQueryResults = await pool.query('SELECT user_profile.first_name, user_profile.last_name FROM user_profile, user_applications WHERE user_profile.id = user_applications.u_id AND user_applications.a_id = $1', [applicantId]);
    let jobQueryResults = await pool.query('SELECT title FROM job_post WHERE id = $1', [jobId]);
    if(userQueryResults.rows.length && jobQueryResults.rows.length){
      let formattedJobTitle = jobQueryResults.rows[0].title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
      return `${formattedJobTitle}-${userQueryResults.rows[0].first_name}${userQueryResults.rows[0].last_name}-package.zip`
    }
    return 'applicant-package.zip'
  }catch(error){
    throw error;
  }
}
