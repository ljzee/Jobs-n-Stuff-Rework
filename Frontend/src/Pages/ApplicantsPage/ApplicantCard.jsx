import React from 'react';
import './Applicants.css';
import {Card, Button, ToggleButtonGroup, ToggleButton, InputGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {businessService} from '@/_services';

class ApplicantCard extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    const {aId, jobId, id, firstName, lastName, phoneNumber, email, color} = this.props;
    return(
      <Card className="candidate-card">
        <div className="candidate-card-upper">
          <span className="candidate-card-upper-helper">
          </span>
          <img style={{border: `5px solid  ${color}`}} src={require('../../Images/profile-icon.png')}/>
        </div>
        <div className="candidate-card-name"><span>{`${firstName} ${lastName}`}</span></div>
        <div className="candidate-card-contact">
          <div><img src={require('../../Images/phone.png')}/>{phoneNumber}</div>
          <div><img src={require('../../Images/email.png')}/>{email}</div>
        </div>
        <div className="candidate-card-buttons">
          <Button variant="link" onClick={()=>{
            businessService.getApplicantFiles(jobId, aId)
                            .then((res) => {
                              const url = window.URL.createObjectURL(new Blob([res.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              const contentDisposition = res.headers['content-disposition'];
                              let fileName = 'file';
                              if (contentDisposition) {
                                 const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                                 if (fileNameMatch.length === 2)
                                     fileName = fileNameMatch[1];
                             }
                              link.setAttribute('download', fileName);
                              document.body.appendChild(link);
                              link.click();
                               link.remove();
                               window.URL.revokeObjectURL(url);
                            })
                            .catch(error=>console.log(error))
          }}>Download Package</Button>
          <Button variant="link">View Profile</Button>
        </div>
        <div className="candidate-card-options">
          <Button variant="success">Accept</Button>
          <Button variant="warning">Save</Button>
          <Button variant="danger">Reject</Button>
        </div>
      </Card>
    )
  }

}

export {ApplicantCard}
