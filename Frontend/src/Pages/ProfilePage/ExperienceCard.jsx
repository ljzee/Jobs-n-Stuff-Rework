import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Button, Row, Col, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import profileicon from '../../Images/profile-icon.png'

import './Profile.css';

import { authenticationService, userService } from '@/_services';

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
          <Button variant="link" className="card-button float-right" onClick={()=>{
            userService.deleteExperience(this.props.experience_id)
              .then(this.props.updateProfile);
          }}>Delete</Button>
          <Button variant="link" className="card-button float-right" onClick={this.toggleEdit}>Edit</Button>
          <Row>
            <Col xs={12} s={12} md={12} lg={2}>
              <div>Present</div>
              <div>-</div>
              <div>2015</div>
            </Col>
            <Col xs={12} s={12} md={12} lg={10}>
              <p><b>{this.state.company}</b> - {this.state.title}</p>
              <p>{this.state.location}</p>
              <p><b>Description: </b>{this.state.description}</p>
            </Col>
          </Row>
        </div>
        }

        {this.state.isEditting &&
        <div>
        <Formik
            initialValues={{
              company: this.props.company,
              title: this.props.title,
              location: this.props.location,
              duration: this.props.duration,
              description: this.props.description
            }}
            validationSchema={Yup.object().shape({
                company: Yup.string().required('Company is required'),
                title: Yup.string().required('Company is required'),
                location: Yup.string().required('Company is required'),
                duration: Yup.string().required('Company is required'),
                description: Yup.string()
            })}
            onSubmit={({company, title, location, duration, description}, { setStatus, setSubmitting }) => {

              this.toggleEdit();
            }}
            render={({ values, errors, status, touched, isSubmitting }) => (
                <Form>
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
                      <Button variant="secondary" className="edit-button float-right" onClick={this.toggleEdit}>Cancel</Button>
                      <Button variant="primary" className="edit-button float-right" type="submit">Save</Button>
                    </div>
                    {status &&
                        <div className={'alert alert-danger'}>{status.map((msg, i) => <li key={i}>{msg}</li>)}</div>
                    }
                </Form>
            )}
        />
        </div>
        }
      </ListGroupItem>
    )
  }
}




export {ExperienceCard};
