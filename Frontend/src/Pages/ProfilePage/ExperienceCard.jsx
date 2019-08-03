import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Button, Row, Col, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import profileicon from '../../Images/profile-icon.png'
import DatePicker from 'react-datepicker';

import './Profile.css';

import { authenticationService, userService } from '@/_services';

class ExperienceCard extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        isEditting: false,
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
    const startDateSplit = this.props.startDate.split('-');
    const endDateSplit = (this.props.endDate === null ? null : this.props.endDate.split('-'));
    return(
      <ListGroupItem>
        {!this.state.isEditting &&
        <div>
          <Row>
            <Col className="duration" xs={12} s={12} md={12} lg={2}>
              <span>{(this.props.endDate === null ? 'Present' : `${endDateSplit[0]}/${endDateSplit[1]}`)}</span>
              <span>-</span>
              <span>{`${startDateSplit[0]}/${startDateSplit[1]}`}</span>
            </Col>
            <Col xs={12} s={12} md={12} lg={8}>
              <p><b>{this.props.company}</b> - {this.props.title}</p>
              <p>{this.props.location}</p>
              <p><b>Description: </b>{this.props.description}</p>
            </Col>
            <Col xs={12} s={12} md={12} lg={2} style={{padding: 0}}>
              <Button variant="link" className="card-button" onClick={()=>{
                userService.deleteExperience(this.props.experience_id)
                  .then(()=>{this.props.fetchProfile()});
              }}>Delete</Button>
              <Button variant="link" className="card-button" onClick={this.toggleEdit}>Edit</Button>
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
              startDate: this.props.startDate,
              endDate: this.props.endDate,
              description: this.props.description
            }}
            validationSchema={Yup.object().shape({
                company: Yup.string().required('Company is required'),
                title: Yup.string().required('Company is required'),
                location: Yup.string().required('Company is required'),
                startDate: Yup.string().required('Start date is required'),
                endDate: Yup.string(),
                description: Yup.string()
            })}
            onSubmit={({company, title, location, startDate, endDate, description}, { setStatus, setSubmitting }) => {
              userService.editExperience(this.props.experience_id, company, title, location, startDate, endDate, description)
                         .then(()=>{
                           this.props.fetchProfile();
                         })
              this.toggleEdit();
            }}
            render={({ values, errors, status, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
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
