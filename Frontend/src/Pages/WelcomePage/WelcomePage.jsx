import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {Jumbotron, Container, Row, Col, Carousel, Card, Button, Nav} from 'react-bootstrap';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import CountUp from 'react-countup';

import { authenticationService } from '@/_services';

import './Welcome.css'


class WelcomePage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/dashboard');
        }
    }


    render() {
        return (
            <div className="welcome-page">
              <Row>
                <Col >

                  <Carousel>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require('../../Images/WelcomeBackground.jpg')}
                        alt="First slide"
                      />
                      <Carousel.Caption>
                        <h4 className="JumbotronMessage">The best time to start was yesterday, the next best time is now.</h4>
                        <Button className="JumbotronButton" href="/signup">Start Here</Button>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require('../../Images/WelcomeBackground.jpg')}
                        alt="Third slide"
                      />

                      <Carousel.Caption>
                        <h4 className="JumbotronMessage">The best time to start was yesterday, the next best time is now.</h4>
                        <Button className="JumbotronButton" href="/signup">Start Here</Button>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>

                </Col>
              </Row>

              <Row>
                <Col>
                  <Card>
                    <Button variant="light">
                      <Nav.Link as={Link} to="signup">
                        <Card.Body>
                        <img className="welcome-page-icon" src={require('../../Images/suitcase.png')} alt="work-briefcase"/>
                        <Card.Text>Looking for work?</Card.Text>
                        </Card.Body>
                      </Nav.Link>
                    </Button>
                  </Card>
                </Col>
                <Col>
                <Card>
                  <Button variant="light">
                    <Nav.Link as={Link} to="signup">
                      <Card.Body>
                      <img className="welcome-page-icon" src={require('../../Images/team.png')} alt="people"/>
                      <Card.Text>Looking for talent?</Card.Text>
                      </Card.Body>
                    </Nav.Link>
                  </Button>
                </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                    <CountUp className='number' end={512} duration={2}/><br/>Jobs Available
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                <Card>
                  <Card.Body>
                  <CountUp className='number' end={315} duration={2}/><br/>Applicants Contacted
                  </Card.Body>
                </Card>
                </Col>
                <Col>
                <Card>
                  <Card.Body>
                  <CountUp className='number' end={15} duration={2}/><br/>New Companies
                  </Card.Body>
                </Card>
                </Col>
              </Row>
            </div>
        )
    }
}

export { WelcomePage };
