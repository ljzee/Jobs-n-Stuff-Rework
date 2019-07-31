import React from 'react';
import {Row, Col, Card, Alert, Table, Button} from 'react-bootstrap';
import './Dashboard.css';
import { Link } from 'react-router-dom'
import Calendar from 'rc-calendar';

class BusinessDashboard extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div>
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header style={{padding: ".42rem 1.25rem", border: "0px"}}>
                <span className="dashboard-card-title">Notifications</span>
                <img className="icon"  src={require('../../Images/bell.png')} alt="bell"/>
              </Card.Header>
              <Table className="notifications-table" style={{tableLayout: "fixed", marginBottom: 0}}>
                <tbody>
                  <tr>
                    <td className="notifications-cell-content"><Link to="/">Janet Smith</Link> has applied for <Link to="/">Junior Software Developer (Vancouve - British Columbia)</Link><div className="notifications-timestamp">5 minutes ago</div></td>
                    <td className="notifications-cell-button"><Button className="unsave-button">View</Button></td>
                  </tr>
                  <tr>
                    <td className="notifications-cell-content"><Link to="/">Peter Chao</Link> has applied for <Link to="/">Intermediate QA Analyst (Coquitlam - British Columbia)</Link><div className="notifications-timestamp">2 hours ago</div></td>
                    <td className="notifications-cell-button"><Button className="unsave-button">View</Button></td>
                  </tr>
                  <tr>
                    <td className="notifications-cell-content"><Link to="/">Joan Winters</Link> has applied for <Link to="/">Database Analyst (Burnaby - British Columbia)</Link><div className="notifications-timestamp">Tuesday</div></td>
                    <td className="notifications-cell-button"><Button className="unsave-button">View</Button></td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <Card>
              <Card.Header>Current Openings</Card.Header>
            </Card>
          </Col>

          <Col md={4} >
            <span className="dashboard-card-title">Calendar</span>
            <Calendar showDateInput={false}/>

          </Col>

        </Row>
      </div>
    )
  }
}

export {BusinessDashboard}
