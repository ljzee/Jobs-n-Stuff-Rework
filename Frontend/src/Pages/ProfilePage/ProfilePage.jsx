import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Button, Row, Col, Form, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import profileicon from '../../Images/profile-icon.png'

import './Profile.css';

import { authenticationService, userService } from '@/_services';

const experiences = [
  {
    id: "111",
    company: "London Drugs",
    title: "Team Leader",
    location: "Burnaby, BC",
    duration: "5 Years",
    description: "Devised and prioritized work plan for team members taking into account present challenges and individual ability Maintained consistent communication with management to ensure company goals are met"
  },
  {
    id: "9",
    company: "London Drugs",
    title: "Team Leader",
    location: "Burnaby, BC",
    duration: "5 Years",
    description: "Devised and prioritized work plan for team members taking into account present challenges and individual ability Maintained consistent communication with management to ensure company goals are met"
  },
  {
    id: "55",
    company: "London Drugs",
    title: "Team Leader",
    location: "Burnaby, BC",
    duration: "5 Years",
    description: "Devised and prioritized work plan for team members taking into account present challenges and individual ability Maintained consistent communication with management to ensure company goals are met"
  }
];

class ExperienceCard extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        isEditting: false,
        company: this.props.company,
        title: this.props.title,
        location: this.props.location,
        duration: this.props.duration,
        description: this.props.description
      }
      this.toggleEdit = this.toggleEdit.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }

  toggleEdit(){
    this.setState(prevState => ({
      ...prevState,
      isEditting: !prevState.isEditting
    }))
  }

  handleChange(event){
    event.persist();

    this.setState(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))

  }

  render(){
    return(
      <ListGroupItem>
        {!this.state.isEditting &&
        <div>
          <Button variant="link" className="float-right" onClick={this.toggleEdit}>Edit</Button>
          <p><b>Company: </b>{this.state.company}</p>
          <p><b>Title: </b>{this.state.title}</p>
          <p><b>Location: </b>{this.state.location}</p>
          <p><b>Duration: </b>{this.state.duration}</p>
          <p><b>Description: </b>{this.state.description}</p>
        </div>
        }

        {this.state.isEditting &&
        <div>
          <Form>
            <Form.Group as={Row} className="edit-field">
              <Form.Label column sm="2"><b>Company:</b></Form.Label>
              <Col >
                <Form.Control type="text" value={this.state.company} onChange={this.handleChange} name='company' />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="edit-field">
              <Form.Label column sm="2"><b>Title:</b></Form.Label>
              <Col>
                <Form.Control type="text"  value={this.state.title} onChange={this.handleChange} name='title' />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="edit-field">
              <Form.Label column sm="2"><b>Location:</b> </Form.Label>
              <Col>
                <Form.Control type="text" value={this.state.location} onChange={this.handleChange} name='location'/>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="edit-field">
              <Form.Label column sm="2"><b>Duration:</b> </Form.Label>
              <Col>
                <Form.Control type="text" value={this.state.duration} onChange={this.handleChange} name='duration'/>
              </Col>
            </Form.Group>
            <Form.Group className="edit-field">
              <Form.Label><b>Description:</b> </Form.Label>
              <Form.Control as="textarea"  value={this.state.description} onChange={this.handleChange} name="description" rows="5"/>
            </Form.Group>
          </Form>
          <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEdit}>Cancel</Button>
          <Button variant="primary" className="edit-button float-right" onClick={this.toggleEdit}>Save</Button>
        </div>
        }
      </ListGroupItem>
    )
  }
}

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: false,
          editAboutMe: false,
          editContactInformation: false,
          firstName: '',
          lastName: '',
          aboutMe: '',
          email: '',
          phoneNumber: '',
          personalWebsite: '',
          githubLink: '',
          experiences: [],
          education: []
        }

        this.toggleEditAboutMe = this.toggleEditAboutMe.bind(this);
        this.toggleEditContactInformation = this.toggleEditContactInformation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.toggleShowModal = this.toggleShowModal.bind(this);
    }

    componentDidMount(){
      userService.getProfile()
      .then(profile =>{
        console.log(profile)
        this.setState(prevState => ({
          ...prevState,
          firstName: profile.first_name,
          lastName: profile.last_name,
          aboutMe: profile.bio,
          email: profile.email,
          phoneNumber: profile.phone_number,
          personalWebsite: profile.personal_website,
          githubLink: profile.github_link
        }))
      }).catch(error =>{
        setSubmitting(false);
        setStatus(error);
      });
    }

    toggleShowModal(){
      this.setState(prevState => ({
        ...prevState,
        showModal: !prevState.showModal
      }))
    }

    toggleEditAboutMe(){
      this.setState(prevState => ({
        ...prevState,
        editAboutMe: !prevState.editAboutMe
      }))
    }

    toggleEditContactInformation(){
      this.setState(prevState => ({
        ...prevState,
        editContactInformation: !prevState.editContactInformation
      }))
    }

    //Since react recycle events, event will be nullified before calling the asynchronous method this.setState(), must use event.persist
    //https://reactjs.org/docs/events.html#event-pooling
    handleChange(event){
      event.persist();

      this.setState(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value
      }))

    }

    handleFileSelect(event){
      console.log(event.target.files[0]);
    }

    render() {
        return (
          <div className="profile-page mx-auto">
            <Row>
              <Col sm={{span: 9, offset: 3}} style={{marginBottom: 0}}>
                <h2>My Profile</h2>
              </Col>
            </Row>

            <Row >
              <Col sm={3}>
                <Card >
                  <Card.Header>Profile Picture</Card.Header>
                  <Card.Body>
                    <Card.Img variant="top" src={profileicon}/>
                    <input style={{fontSize: 11, marginTop: 10}} type="file" onChange={this.handleFileSelect}/>
                    <div className="contact-info">
                      <h5 className="contact-info-title">Contact Info</h5>
                      <p><b>Email:</b><br/>{this.state.email}</p>
                      <p><b>Phone Number:</b><br/>{this.state.phoneNumber}</p>
                      <p><b>Personal Website:</b><br/><a href=''>{this.state.personalWebsite}</a></p>
                      <p><b>Github:</b><br/><a href=''>{this.state.githubLink}</a></p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={9}>
                <Card className="profile-page-card">
                  <Card.Header>About Me</Card.Header>

                    {!this.state.editAboutMe &&
                      <Card.Body>
                        <Card.Text>
                          {this.state.aboutMe}
                        </Card.Text>
                        <Button variant="link" className="float-right" onClick={this.toggleEditAboutMe}>Edit</Button>
                      </Card.Body>
                    }
                    {this.state.editAboutMe &&
                      <Card.Body>
                        <Form>
                          <Form.Group>
                            <Form.Control as="textarea" value={this.state.aboutMe} name="aboutMe" onChange={this.handleChange} rows="5"/>
                          </Form.Group>
                        </Form>
                        <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEditAboutMe}>Cancel</Button>
                        <Button variant="primary" className="edit-button float-right" onClick={this.toggleEditAboutMe}>Save</Button>
                      </Card.Body>
                    }
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Experience
                    <Button variant="outline-danger" className="add-button float-right" onClick={this.toggleShowModal}>-</Button>
                    <Button variant="outline-success" className="add-button float-right" onClick={this.toggleShowModal}>+</Button>
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    {experiences.map((experience, id) => <ExperienceCard key={id} company={experience.company} title={experience.title} location={experience.location} duration={experience.duration} description={experience.description}/>)}
                  </ListGroup>
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Education
                    <Button variant="outline-danger" className="add-button float-right" onClick={this.toggleShowModal}>-</Button>
                    <Button variant="outline-success" className="add-button float-right" onClick={this.toggleShowModal}>+</Button>
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      <Button variant="link" className="float-right" onClick={this.toggleEditAboutMe}>Edit</Button>
                      <p><b>School Name: </b>Simon Fraser University</p>
                      <p><b>Attained/Currently Pursuing Title: </b>Bachelors Of Science</p>
                      <p><b>Location: </b>Burnaby, BC</p>
                      <p><b>Duration: </b>2013 - 2019</p>
                    </ListGroupItem>
                  </ListGroup>
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Contact Information</Card.Header>
                  {!this.state.editContactInformation &&
                    <Card.Body>
                      <p><b>Email:</b> {this.state.email}</p>
                      <p><b>Phone Number:</b> {this.state.phoneNumber}</p>
                      <p><b>Personal Website:</b> <a href=''>{this.state.personalWebsite}</a></p>
                      <p><b>Github:</b> <a href=''>{this.state.githubLink}</a></p>
                      <Button variant="link" className="float-right" onClick={this.toggleEditContactInformation}>Edit</Button>
                    </Card.Body>
                  }

                  {this.state.editContactInformation &&
                    <Card.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label><b>Email:</b> </Form.Label>
                          <Form.Control type="email" value={this.state.email} name='email' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label><b>Phone Number:</b> </Form.Label>
                          <Form.Control type="text" value={this.state.phoneNumber} name='phoneNumber' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label><b>Personal Website:</b> </Form.Label>
                          <Form.Control type="text" value={this.state.personalWebsite} name='personalWebsite' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label><b>Github:</b> </Form.Label>
                          <Form.Control type="text" value={this.state.githubLink} name='githubLink' onChange={this.handleChange} />
                        </Form.Group>
                      </Form>
                      <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEditContactInformation}>Cancel</Button>
                      <Button variant="primary" className="edit-button float-right" onClick={this.toggleEditContactInformation}>Save</Button>
                    </Card.Body>
                  }
                </Card>

                </Col>
              </Row>

              <Modal show={this.state.showModal} onHide={this.toggleShowModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.toggleShowModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={this.toggleShowModal}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
        )
    }
}
/*
<Formik
    initialValues={{
        email: '',
        phonenumber: '',
        personalwebsite: '',
        github: ''
    }}
    validationSchema={Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
    })}
    render={({ values, errors, status, touched, isSubmitting }) => (
        <Form>
            <div className="form-group">
                <label htmlFor="email"><b>Email:</b> </label>
                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group">
                <label htmlFor="username"><b>Phone Number:</b> </label>
                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                <ErrorMessage name="username" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group">
                <label htmlFor="personalwebsite"><b>Personal Website:</b></label>
                <Field name="personalwebsite" type="text" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group">
                <label htmlFor="github"><b>Github:</b></label>
                <Field name="github" type="text" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
            </div>
            <br />
            <div className="form-group">
              <Button variant="danger" className="edit-button float-right" onClick={this.toggleEditContactInformation}>Cancel</Button>
              <Button variant="success" className="edit-button float-right" onClick={this.toggleEditContactInformation}>Save</Button>
                {isSubmitting &&
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
            </div>
            {status &&
                <div className={'alert alert-danger'}>{status.map((msg, i) => <li key={i}>{msg}</li>)}</div>
            }
        </Form>
    )}
/>
*/
export { ProfilePage };
