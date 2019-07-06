import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';

import {Navbar, Nav, Container} from 'react-bootstrap';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };

    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin } = this.state;

        let navItems = null;
        //console.log(currentUser);
        if(!currentUser){
          navItems = <React.Fragment>
                      <Nav.Link as={Link} to="login">Login</Nav.Link>
                      <Nav.Link as={Link} to="signup">Sign Up</Nav.Link>
                     </React.Fragment>;
        }else{
          if(currentUser.role === Role.User){
            navItems = <React.Fragment>
                        <Nav.Item>
                        <Nav.Link>Job Postings</Nav.Link>
                        </Nav.Item>
                        <Nav.Link>Applications</Nav.Link>
                        <Nav.Link>Documents</Nav.Link>
                        <Nav.Link>Profile</Nav.Link>
                        <Nav.Item onClick={this.logout}><Nav.Link>Logout</Nav.Link></Nav.Item>
                       </React.Fragment>;
          }

          if(currentUser.role === Role.Admin){
            navItems = <React.Fragment>
                        <Nav.Item>
                        <Nav.Link as={Link} to="manage_users">Manage Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Link>Job Postings</Nav.Link>
                        <Nav.Item onClick={this.logout}><Nav.Link>Logout</Nav.Link></Nav.Item>
                       </React.Fragment>;
          }

          if(currentUser.role === Role.Business){
            navItems = <React.Fragment>
                         <Nav.Link>Manage Postings</Nav.Link>
                         <Nav.Link>Profile</Nav.Link>
                         <Nav.Item onClick={this.logout}>Logout</Nav.Item>
                       </React.Fragment>;
          }
        }

        return (
            <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>EmployMee</Navbar.Brand>
              <Nav className="ml-auto">
              {navItems}
              </Nav>
              </Container>
            </Navbar>
        );
    }
}

export { Header };
