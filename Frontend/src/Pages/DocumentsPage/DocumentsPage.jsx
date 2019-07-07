import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import {Navbar, Nav, NavDropdown, Form, FormControl, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import './Documents.css';
import Select from 'react-select';

import { authenticationService } from '@/_services';

const techCompanies = [
  { label: "All", value: 1 },
  { label: "Resume", value: 2 },
  { label: "Cover Letter", value: 3 },
  { label: "Others", value: 4 },
];

class DocumentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.selectOption = this.selectOption.bind(this);
        this.state = {
          documentFilter: "All"
        }
    }

    selectOption(option){
      console.log(option)
      this.setState(prevState => ({
        ...prevState,
        documentFilter: option
      }))
    }



    render() {
        return (
          <div className="documents-page mx-auto">
            <h2 className="documents-page-title">My Documents</h2>
            <Navbar bg="white" expand="lg">
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Select className="filter-select" placeholder="Document type" options={ techCompanies } />
                </Nav>
                <Form inline>
                  <FormControl type="text" placeholder="Search Documents" className="mr-sm-2" />
                  <Button variant="outline-primary">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
          </div>
        )
    }
}

export { DocumentsPage };
