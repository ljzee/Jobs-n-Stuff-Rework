import React from 'react';
import {Link} from 'react-router-dom';
import {Spinner, Card, Button, Row, Col, Form, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form as FForm } from 'formik';
import * as Yup from 'yup';
import profileicon from '../../Images/profile-icon.png'
import {ExperienceCard} from './ExperienceCard';
import { ImagePicker } from 'react-file-picker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import config from 'config';

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

        let currentUser = authenticationService.currentUserValue;

        this.state = {
          showModal: false,
          editAboutMe: false,
          editContactInformation: false,
          id: currentUser.id,
          firstName: '',
          lastName: '',
          aboutMe: '',
          email: '',
          phoneNumber: '',
          personalWebsite: '',
          githubLink: '',
          experiences: [],
          education: [],
          profileImageName: '',
          isLoading: true
        }

        this.toggleEditAboutMe = this.toggleEditAboutMe.bind(this);
        this.toggleEditContactInformation = this.toggleEditContactInformation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.toggleShowModal = this.toggleShowModal.bind(this);
        this.refreshProfile = this.refreshProfile.bind(this);
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
          githubLink: profile.github_link,
          experiences: profile.experiences,
          profileImageName: profile.profile_image_name,
          isLoading:false
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

    refreshProfile(){
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



    render() {

        if(this.state.isLoading) return(

          <div className="profile-page mx-auto">
            <Row>
              <Col xs={12} sm={12} md={{span: 7, offset: 5}} lg={{span: 9, offset: 3}} style={{marginBottom: 0}}>
                <h2 className="profile-page-title">My Profile</h2>
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </div>
        )

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
                  <Card.Header>Personal</Card.Header>
                  <Card.Body>
                    <h6>Welcome back, {this.state.firstName}!</h6>
                    {this.state.profileImageName && <Card.Img className="profile-image" variant="top" src={`${config.apiUrl}/users/profile/profile-image/${this.state.profileImageName}`}/>}
                    {!this.state.profileImageName && <Card.Img className="profile-image" variant="top" src={profileicon}/>}
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

                <Card>
                  <Card.Header>Account Settings</Card.Header>
                  <Card.Body>
                    <Button className="setting-button" variant="link">Change Password</Button>
                    <Button className="setting-button" variant="link">Delete Account</Button>
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
                        <Button variant="primary" className="edit-button float-right" onClick={()=>{
                          userService.updateProfile(this.state.aboutMe, this.state.phoneNumber, this.state.personalWebsite, this.state.githubLink)
                                     .then(()=>{
                                       this.toggleEditAboutMe();
                                       this.refreshProfile();
                                     })
                                     .catch(error=>console.log(error))
                        }
                        }>Save</Button>
                      </Card.Body>
                    }
                </Card>

                <Card className="profile-page-card">
                  <Card.Header>Experience
                    <Button variant="outline-success" className="add-button float-right" onClick={this.toggleShowModal}>+</Button>
                  </Card.Header>
                  <ListGroup className="list-group-flush">
                    {this.state.experiences.map((experience) => <ExperienceCard key={experience.experience_id} experience_id={experience.experience_id} company={experience.company_name} title={experience.title} location={experience.location} description={experience.description} startDate={experience.start_date} endDate={experience.end_date} refreshProfile={this.refreshProfile}/>)}
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
                      <Button variant="primary" className="edit-button float-right" onClick={()=>{
                        userService.updateProfile(this.state.aboutMe, this.state.phoneNumber, this.state.personalWebsite, this.state.githubLink)
                                   .then(()=>{
                                     this.toggleEditContactInformation();
                                     this.refreshProfile();
                                   })
                                   .catch(error=>console.log(error))
                      }}>Save</Button>
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
                      description: '',
                      startDate: '',
                      endDate: ''
                    }}
                    validationSchema={Yup.object().shape({
                        company: Yup.string().required('Company is required'),
                        title: Yup.string().required('Title is required'),
                        location: Yup.string().required('Location is required'),
                        description: Yup.string(),
                        startDate: Yup.string().required('Start date is required'),
                        endDate: Yup.string()
                    })}
                    onSubmit={({company, title, location, description, startDate, endDate}, { setStatus, setSubmitting }) => {
                      userService.addExperience(company, title, location, startDate, endDate, description).then(()=>{
                        this.refreshProfile();
                        this.toggleShowModal();
                      })
                    }}
                    render={({ values, errors, status, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
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
                                <label className="date-label" htmlFor="startDate"><b>Start Date:</b></label>
                                <DatePicker name="startDate" value={values.startDate}
                                  onChange={(date) =>{
                                    setFieldValue("startDate",date.toISOString().split("T")[0])
                                  }}
                                  onBlur={()=>setFieldTouched('startDate', true)}
                                />
                                {errors.startDate && touched.startDate && (
                                  <div
                                    style={{ color: "#dc3545", marginTop: ".10rem", fontSize:"80%" }}
                                  >
                                    {errors.startDate}
                                  </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="date-label" htmlFor="endDate"><b>End Date:</b></label>
                                <DatePicker name="endDate" value={values.endDate}
                                  onChange={(date) =>{
                                    setFieldValue("endDate",date.toISOString().split("T")[0])
                                  }}
                                />
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
