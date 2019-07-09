import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import {Navbar, Nav, NavDropdown, Form, FormControl, Button, Dropdown, DropdownButton, Table, Modal} from 'react-bootstrap';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import './Documents.css';
import Select from 'react-select';
import { FilePicker } from 'react-file-picker'

import { authenticationService, fileService } from '@/_services';

const documents = [
  {
    fileName: 'LouisZhuoResume.pdf',
    fileType: 'Resume',
    fileSize: 256,
    dateUploaded: '07/07/19'
  },
  {
    fileName: 'LouisZhuoCoverletter.pdf',
    fileType: 'Cover Letter',
    fileSize: 496,
    dateUploaded: '07/07/19'
  }
]

const filterOptions = [
  { label: "All", value: "All"},
  { label: "Resume", value: "Resume" },
  { label: "Cover Letter", value: "Cover Letter" },
  { label: "Others", value: "Others" },
];

class Document extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      editFile: false,
      fileName: this.props.fileName
    }

    this.handleChange = this.handleChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit(){
    this.setState(prevState => ({
      ...prevState,
      editFile: !prevState.editFile
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
      <tr>
        <td>{this.props.documentNo}</td>
          {this.state.editFile
            ? <td className="document-name document-name-input"><FormControl name="fileName" type="text" value={this.state.fileName} onChange={this.handleChange}/></td>
            : <td className="document-name" ><a href="#">{this.state.fileName}</a></td>
          }
        <td>{this.props.fileType}</td>
        <td>{`${this.props.fileSize}kb`}</td>
        <td>{this.props.dateUploaded}</td>
        {this.state.editFile
          ?
          <td className="document-name-input"><Button variant="primary" onClick={this.toggleEdit}>Save</Button></td>
          :
          <td>
          <React.Fragment>
            <Button variant="link" className="card-button" onClick={this.toggleEdit}>Edit</Button>
            <Button variant="link" className="card-button">Delete</Button>
          </React.Fragment>
          </td>
        }
      </tr>
    )
  }
}

class DocumentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          documentFilter: "All",
          showFileUploadModal: false,
          selectedFile: null,
          selectedFileType: "",
          selectedFileRename: ""
        }

        this.toggleShowFileUploadModal = this.toggleShowFileUploadModal.bind(this);
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    selectOption(name, option){
      this.setState(prevState => ({
        ...prevState,
        [name]: option.value
      }))
    }

    toggleShowFileUploadModal() {
      this.setState(prevState=> ({
          ...prevState,
          showFileUploadModal: !prevState.showFileUploadModal
        }))
    }

    onChangeFileHandler(event){
      event.persist();
      this.setState(prevState=> ({
          ...prevState,
          selectedFile: event.target.files[0]
        }))
    }

    onChangeHandler(event){
      event.persist();
      this.setState(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value
      }))
    }

    uploadFile(){
      //console.log(this.state)
      fileService.uploadFile(this.state.selectedFile, this.state.selectedFileType, this.state.selectedFileRename)
      .then(result=>{
        this.setState(prevState=> ({
            ...prevState,
            selectedFile: null,
            selectedFileType: "",
            selectedFileRename: "",
            showFileUploadModal: false
          }))
      })
      .catch(error=>{
        console.log(error);
      })
    }

    render() {
        return (
          <div className="documents-page mx-auto">
          <Button variant="primary float-right" onClick={this.toggleShowFileUploadModal}>Upload Document</Button>
            <h2 className="documents-page-title">My Documents</h2>
            <Navbar bg="white" expand="lg">
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Select className="filter-select" placeholder="Document type" options={ filterOptions } onChange={this.selectOption.bind(this, 'documentFilter')} />
                </Nav>
                <Form inline>
                  <FormControl type="text" placeholder="Search Documents" className="mr-sm-2" />
                  <Button variant="outline-primary">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
            <Table className="files-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>File Size</th>
                  <th>Date Uploaded</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document, index)=>{
                  return (<Document key={index} documentNo={index + 1} fileName={document.fileName} fileType={document.fileType} fileSize={document.fileSize} dateUploaded={document.dateUploaded}/>)
                })}
              </tbody>
            </Table>

            <Modal show={this.state.showFileUploadModal} onHide={this.toggleShowFileUploadModal}>
              <Modal.Header closeButton>
                <Modal.Title>Upload a new document</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <form method="post" action="#" id="#">
                <div className="form-group files color">
                  <input type="file" className="form-control" onChange={this.onChangeFileHandler}/>
                </div>
              </form>
              <div className="form-options">
                <span className="modal-label">File Type:</span>
                <Select className="filter-select modal-select" placeholder="Document type" options={ filterOptions.slice(1,4) } onChange={this.selectOption.bind(this, 'selectedFileType')}/>
              </div>
              <div className="form-options">
                <span className="modal-label">Rename:</span>
                <FormControl name="selectedFileRename" className="filter-select modal-select" type="text" placeholder="Optional" value={this.state.selectedFileRename} onChange={this.onChangeHandler}/>
              </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.toggleShowFileUploadModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.uploadFile}>
                  Upload
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )
    }
}

export { DocumentsPage };
