import React from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, ListGroup, Card, Pagination} from 'react-bootstrap';
import './JobSearch.css'

const JobCard = (props) => {
  let formattedJobTitle = props.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
  return(
    <Link className="job-card" to={{pathname: `/searchjobs/${formattedJobTitle}`, state: {id: props.jobId}}}>
      <Card>
        <Card.Body>
          <button onClick={()=>{console.log('bookmarked')}} className="job-card-bookmark-btn"/>
          <div className="job-card-title">{props.title} <span>({props.positionType})</span></div>
          <div className="job-card-company-location">{props.companyName} - {props.city}, {props.state}</div>
          <div className="job-card-description">{props.description}</div>
          <div className="job-card-date-published">Published: 2019-07-24</div>
        </Card.Body>
      </Card>
    </Link>
  )
}

export default JobCard;
