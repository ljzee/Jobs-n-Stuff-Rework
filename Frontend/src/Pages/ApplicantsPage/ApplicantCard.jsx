import React from 'react';
import './Applicants.css';
import {Card, Button, ToggleButtonGroup, ToggleButton, InputGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom';


class ApplicantCard extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    const {id, firstName, lastName, phoneNumber, email, color} = this.props;
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
          <Button variant="link">Download Package</Button>
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
