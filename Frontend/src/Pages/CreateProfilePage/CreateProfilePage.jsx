import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Button, Row, Col, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import './CreateProfile.css';
import Select from 'react-select';

import { authenticationService, userService } from '@/_services';

class CreateProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          currentUser: authenticationService.currentUserValue
        }

    }

    render() {

        const {currentUser} = this.state;

        const userForm =   <Formik
                            initialValues={{
                                firstname: '',
                                lastname: '',
                                phonenumber: '',
                                personalwebsite: '',
                                githublink: '',
                                bio: ''
                            }}
                            validationSchema={Yup.object().shape({
                                firstname: Yup.string().required('First name is required'),
                                lastname: Yup.string().required('Last name is required'),
                                phonenumber: Yup.string(),
                                personalwebsite: Yup.string(),
                                githublink: Yup.string(),
                                bio: Yup.string()
                            })}
                            onSubmit={({ firstname, lastname, phonenumber, personalwebsite, githublink, bio }, { setStatus, setSubmitting }) => {
                                setStatus();
                                userService.createProfile(firstname, lastname, phonenumber, personalwebsite, githublink, bio)
                                    .then(
                                      result=>{
                                        const currentUser = authenticationService.currentUserValue;
                                        const { from } = this.props.location.state || { from: { pathname: `/dashboard` } };
                                        this.props.history.push(from);
                                      }
                                    ).catch(error =>{
                                      setSubmitting(false);
                                      setStatus(error);
                                    });
                            }}
                            render={({ errors, status, touched, isSubmitting }) => (
                              <div>
                              <Card className="card">
                                <Card.Body>
                                  <div className="alert alert-info">
                                      <strong>Note: </strong>You will have a chance to change this information in the future!<br />
                                  </div>
                                  <Form>
                                      <div className="form-group">
                                          <label htmlFor="firstname">First Name</label>
                                          <Field name="firstname" type="text" className={'form-control' + (errors.firstname && touched.firstname ? ' is-invalid' : '')} />
                                          <ErrorMessage name="firstname" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="lastname">Last Name</label>
                                          <Field name="lastname" type="text" className={'form-control' + (errors.lastname && touched.lastname ? ' is-invalid' : '')} />
                                          <ErrorMessage name="lastname" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="phonenumber">Phone Number (Optional)</label>
                                          <Field name="phonenumber" type="text" className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                          <ErrorMessage name="phonenumber" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="personalwebsite">Personal Website (Optional)</label>
                                          <Field name="personalwebsite" type="text" className={'form-control' + (errors.personalwebsite && touched.personalwebsite ? ' is-invalid' : '')} />
                                          <ErrorMessage name="personalwebsite" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="githublink">Github Link (Optional)</label>
                                          <Field name="githublink" type="text" className={'form-control' + (errors.githublink && touched.githublink ? ' is-invalid' : '')} />
                                          <ErrorMessage name="githublink" component="div" className="invalid-feedback" />
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="bio">Add a quick bio!</label>
                                          <Field name="bio" component="textarea" rows="5" className={'form-control' + (errors.bio && touched.bio ? ' is-invalid' : '')} />
                                          <ErrorMessage name="bio" component="div" className="invalid-feedback" />
                                      </div>
                                      <Button type="submit" variant="primary" className="edit-button float-right" >Create Profile</Button>
                                      {status &&
                                          <div className={'alert alert-danger'}>{status}</div>
                                      }
                                  </Form>
                                  </Card.Body>
                                </Card>
                              </div>
                            )}
                        />


        const businessForm = <Formik
                                initialValues={{
                                    companyname: '',
                                    phonenumber: '',
                                    website: '',
                                    description: '',
                                }}
                                validationSchema={Yup.object().shape({
                                    companyname: Yup.string().required('Company name is required'),
                                    phonenumber: Yup.string(),
                                    website: Yup.string(),
                                    description: Yup.string()
                                })}
                                onSubmit={({ companyname, phonenumber, website, description}, { setStatus, setSubmitting }) => {
                                    setStatus();
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                  <div>
                                  <Card className="card">
                                    <Card.Body>
                                      <div className="alert alert-info">
                                          <strong>Note: </strong>You will have a chance to change this information in the future!<br />
                                      </div>
                                      <Form>
                                          <div className="form-group">
                                              <label htmlFor="companyname">Company Name</label>
                                              <Field name="companyname" type="text" className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                                              <ErrorMessage name="companyname" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="phonenumber">Phone Number (Optional)</label>
                                              <Field name="phonenumber" type="text" className={'form-control' + (errors.phonenumber && touched.phonenumber ? ' is-invalid' : '')} />
                                              <ErrorMessage name="phonenumber" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="website">Website (Optional)</label>
                                              <Field name="website" type="text" className={'form-control' + (errors.website && touched.website ? ' is-invalid' : '')} />
                                              <ErrorMessage name="website" component="div" className="invalid-feedback" />
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="description">Description (Optional)</label>
                                              <Field name="description" component="textarea" rows="5" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                              <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                          </div>
                                          <Button type="submit" variant="primary" className="edit-button float-right" >Create Profile</Button>
                                          {status &&
                                              <div className={'alert alert-danger'}>{status}</div>
                                          }
                                      </Form>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                )}
                            />


        return (
            <div className="create-profile-page">
              <h2 className="title">Tell us more before you start...</h2>
                {currentUser.role === 'USER' && userForm}
                {currentUser.role === 'BUSINESS' && businessForm}
            </div>
        )
    }
}


/*                                          <div className="form-group">
                                            <label htmlFor="country">Country</label>
                                            <Select/>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <Select/>
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <Select/>
                                          </div>
                                          <div className="form-group">
                                              <label htmlFor="streetaddress">Street Address</label>
                                              <Field name="companyname" type="text" className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                                          </div>
                                          */
export { CreateProfilePage };
