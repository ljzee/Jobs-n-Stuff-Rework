import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Button, Row, Col, Form, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FForm } from 'formik';
import * as Yup from 'yup';
import profileicon from '../../Images/profile-icon.png'
import {ExperienceCard} from './ExperienceCard';
import { ImagePicker } from 'react-file-picker';

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
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidMount(){
      userService.getProfile()
      .then(profile =>{
        this.setState(prevState => ({
          ...prevState,
          firstName: profile.first_name,
          lastName: profile.last_name,
          aboutMe: profile.bio,
          email: profile.email,
          phoneNumber: profile.phone_number,
          personalWebsite: profile.personal_website,
          githubLink: profile.github_link,
          experiences: profile.experiences
        }))
      })
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

    updateProfile(){
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
          githubLink: profile.github_link,
          experiences: profile.experiences
        }))
      })
    }

    render() {
        return (
          <div className="profile-page mx-auto">
            <Row>
              <Col xs={12} sm={12} md={{span: 7, offset: 5}} lg={{span: 9, offset: 3}} style={{marginBottom: 0}}>
                <h2 className="profile-page-title">My Profile</h2>
              </Col>
            </Row>

            <Row >
              <Col xs={12} sm={12} md={5} lg={3}>
                <Card >
                  <Card.Header>Profile Picture</Card.Header>
                  <Card.Body>
                    <h6>Welcome back, {this.state.firstName}!</h6>
                    <Card.Img className="profile-image" variant="top" src={profileicon}/>
                    <ImagePicker
                      extensions={['jpg', 'jpeg', 'png']}
                      dims={{minWidth: 100, maxWidth: 500, minHeight: 100, maxHeight: 500}}
                      onChange={image=>{
                        console.log("image");
                      }}
                      onError={error=>{
                        console.log(error);
                      }}
                    >
                      <Button variant="link" className="image-picker">Upload a photo</Button>
                    </ImagePicker>
                    <div className="contact-info">
                      <h5 className="contact-info-title">Contact Info</h5>
                      <p><b>Email:</b><br/>{this.state.email}</p>
                      <p><b>Phone Number:</b><br/>{this.state.phoneNumber}</p>
                      <p><b>Website:</b><br/><a href=''>{this.state.personalWebsite}</a></p>
                      <p><b>Github:</b><br/><a href=''>{this.state.githubLink}</a></p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={12} md={7} lg={9}>
                <Card className="profile-page-card">
                  <Card.Header>About Me</Card.Header>

                    {!this.state.editAboutMe &&
                      <Card.Body>
                        <Card.Text>
                          {!this.state.aboutMe && <span className="aboutme-helper-message">Write a bio so employers can know you better...</span>}
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
                    <Button variant="outline-success" className="add-button float-right" onClick={this.toggleShowModal}>+</Button>
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    {this.state.experiences.map((experience, id) => <ExperienceCard key={id} experience_id={experience.experience_id} company={experience.company_name} title={experience.title} location={experience.location} duration={experience.duration} description={experience.description} updateProfile={this.updateProfile}/>)}
                  </ListGroup>
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Education
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
                      <Button variant="link" className="float-right" onClick={this.toggleEditContactInformation}>Edit</Button>
                      <p><b>Email:</b> {this.state.email}</p>
                      <p><b>Phone Number:</b> {this.state.phoneNumber}</p>
                      <p><b>Personal Website:</b> <a href=''>{this.state.personalWebsite}</a></p>
                      <p><b>Github:</b> <a href=''>{this.state.githubLink}</a></p>
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
                  <Modal.Title>Add a work experience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Formik
                    initialValues={{
                      company: '',
                      title: '',
                      location: '',
                      duration: '',
                      description: ''
                    }}
                    validationSchema={Yup.object().shape({
                        company: Yup.string().required('Company is required'),
                        title: Yup.string().required('Company is required'),
                        location: Yup.string().required('Company is required'),
                        duration: Yup.string().required('Company is required'),
                        description: Yup.string()
                    })}
                    onSubmit={({company, title, location, duration, description}, { setStatus, setSubmitting }) => {
                      userService.addExperience(company, title, location, duration, description).then(()=>{
                        this.updateProfile();
                        this.toggleShowModal();
                      })
                    }}
                    render={({ values, errors, status, touched, isSubmitting }) => (
                        <FForm>
                            <div className="form-group">
                                <label htmlFor="company"><b>Company:</b></label>
                                <Field name="company" type="text" className={'form-control' + (errors.company && touched.company ? ' is-invalid' : '')} />
                                <ErrorMessage name="company" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title"><b>Title:</b></label>
                                <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                <ErrorMessage name="title" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location"><b>Location:</b></label>
                                <Field name="location" type="text" className={'form-control' + (errors.location && touched.location ? ' is-invalid' : '')} />
                                <ErrorMessage name="location" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration"><b>Duration:</b></label>
                                <Field name="duration" type="text" className={'form-control' + (errors.duration && touched.duration ? ' is-invalid' : '')} />
                                <ErrorMessage name="duration" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description"><b>Description:</b></label>
                                <Field name="description" rows="5" component="textarea" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                            </div>
                            <br />
                            <div className="form-group">
                              <Button variant="secondary" className="edit-button float-right" onClick={this.toggleShowModal}>
                                Close
                              </Button>
                              <Button variant="primary" className="edit-button float-right" type="submit">
                                Add Experience
                              </Button>
                            </div>
                            {status &&
                                <div className={'alert alert-danger'}>{status.map((msg, i) => <li key={i}>{msg}</li>)}</div>
                            }
                        </FForm>
                    )}
                />
                </Modal.Body>

              </Modal>
            </div>
        )
    }
}

export { ProfilePage };
