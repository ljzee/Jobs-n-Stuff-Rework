import React from 'react';

import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Col, Row, Card, Button, DropdownButton, Dropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import './JobPost.css'

class JobPostPage extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="jobpostpage mx-auto">
        <Row>
          <Col md={3}>
            <Button as={Link} to="/managepostings" variant="link">Back to my postings</Button>
          </Col>

          <Col md={9}>
            <div className="jobpostpage-header">
              <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                <Dropdown.Item onClick={()=>{console.log('edit')}}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={()=>{console.log('stop application')}}>Stop Accepting Applicants</Dropdown.Item>
                <Dropdown.Item onClick={()=>{console.log('view applicants')}}>View Applicants</Dropdown.Item>
                <Dropdown.Item onClick={()=>{console.log('delete posting')}}>Delete Posting</Dropdown.Item>
              </DropdownButton>
              <h3>UX/UI Designer</h3>
              <Link to="/"><img height="22" width="22" src={require('../../Images/building.png')}/>Awesome Software</Link>
              <span className="jobpostpage-header-location"><img height="22" width="22" src={require('../../Images/location.png')}/>Vancouver, British Columbia</span>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Card>
              <Card.Header>Application Info.</Card.Header>
              <Card.Body>
                <div style={{fontSize: "15px", marginBottom: "10px"}}><b>Documents Required</b></div>
                <ul>
                  <li>Resume</li>
                  <li>Cover letter</li>
                </ul>
                <div style={{fontSize: "15px"}}><b>Deadline: </b>2019-09-21</div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Card>
              <Card.Header>Job Description</Card.Header>
              <Card.Body>
                <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a accumsan nunc. Vestibulum ut euismod velit. Pellentesque laoreet pellentesque aliquam. Phasellus quis lorem diam. Fusce convallis magna volutpat scelerisque tincidunt. Ut a odio sed odio condimentum malesuada. Sed eu lacinia felis. Morbi a mauris porta, laoreet nibh vel, dictum nibh.
                </Card.Text>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>Job Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col className="jobdetails-container">
                    <div><b>Position Type: </b>Full-time</div>
                    <div><b>Duration: </b>8 months</div>
                    <div><b>Openings: </b>2</div>
                    <div><b>Salary: </b>$35/Hr</div>
                  </Col>
                  <Col className="jobdetails-container">
                    <div><b>Website: </b><a style={{color: "#007bff"}}>AwesomeSoftware.com</a></div>
                    <div><b>Phone Number: </b>777-777-7777</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="jobpostpage-timestamp" style={{textAlign: "right"}}><b>Date-Published: </b>2019-08-22</div>
          </Col>
        </Row>
      </div>
    )
  }
}

export {JobPostPage};
