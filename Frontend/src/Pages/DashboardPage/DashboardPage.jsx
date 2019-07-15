import React from 'react';
import {Row, Col, Card, Alert, Table} from 'react-bootstrap';
import Calendar from 'rc-calendar';
import './Dashboard.css';
import "rc-calendar/assets/index.css"
import { userService, authenticationService } from '@/_services';

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="dashboard-page mx-auto">
              <h2 className="dashboard-page-title">Dashboard</h2>
              <Row>
                <Col md={8}>
                  <h5>Notifications</h5>
                    <Alert variant={'success'} dismissible>
                      <b>Awesome Software</b> would like to get in touch with you.
                    </Alert>
                    <Alert variant={'secondary'} dismissible>
                      <b>Fortis Security</b> will like to keep in touch when future opportunities arises.
                    </Alert>
                    <Alert variant={'danger'} dismissible>
                      <b>Quantum Inc</b> has decided to move on with other candidates
                    </Alert>
                </Col>

                <Col md={4} >
                  <h5>Calendar</h5>
                  <Calendar showDateInput={false}/>

                </Col>
              </Row>

              <Row>
                <Col>
                  <h5>Bookmarked Postings</h5>
                  <Card>
                  <Table responsive>

                  </Table>
                  </Card>
                </Col>

                <Col>
                  <h5>Recent Searches</h5>
                  <Card>
                  <Table responsive>

                  </Table>
                  </Card>
                </Col>

                <Col>
                  <h5>Statistics</h5>
                  <Card>
                    <Card.Body>
                      <p>Applications Submitted: 143</p>
                      <p>Applications Awaiting Response: 34</p>
                      <p>Companies Contacted: 50</p>
                      <p>Companies Kept On File: 32</p>
                      <p>Companies Moved On: 27</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
        );
    }
}

export { DashboardPage };
