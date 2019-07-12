import React from 'react';
import { Formik, Field, ErrorMessage, Form as FForm } from 'formik';
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

  componentDidUpdate(prevProps){
    if(this.props.fileName !== prevProps.fileName){
      this.setState(prevState => ({
        ...prevState,
        fileName: this.props.fileName
      }))
    }
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
            : <td className="document-name" ><Button variant="link" className="card-button" onClick={()=>{
                fileService.downloadFile(this.props.fileId)
                           .then((res) => {
                             const url = window.URL.createObjectURL(new Blob([res.data]));
                             const link = document.createElement('a');
                             link.href = url;
                             const contentDisposition = res.headers['content-disposition'];
                             let fileName = 'file';
                             if (contentDisposition) {
                                const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                                if (fileNameMatch.length === 2)
                                    fileName = fileNameMatch[1];
                            }
                             link.setAttribute('download', fileName);
                             document.body.appendChild(link);
                             link.click();
                              link.remove();
                              window.URL.revokeObjectURL(url);
                           })
                           .catch(error=>console.log(error))
            }}>{this.state.fileName}</Button></td>
          }
        <td>{this.props.fileType}</td>
        <td className="col_4">{`${this.props.fileSize}kb`}</td>
        <td className="col_5">{this.props.dateUploaded}</td>
        {this.state.editFile
          ?
          <td className="document-name-input">
            <Button variant="primary" className="document-button" onClick={()=>{
              if(this.state.fileName !== this.props.fileName){
                fileService.editFile(this.props.fileId, this.state.fileName)
                           .then(()=>{
                             this.toggleEdit();
                             this.props.fetchUserFiles();
                           })
                           .catch(error=>console.log(error))
                }else{
                  this.toggleEdit();
                }
            }}>Save</Button>
            <Button variant="secondary" className="document-button" onClick={this.toggleEdit}>Cancel</Button>
          </td>
          :
          <td>
          <React.Fragment>
            <Button variant="link" className="card-button" onClick={this.toggleEdit}>Edit</Button>
            <Button variant="link" className="card-button" onClick={()=>{

              this.props.deleteFile(this.props.fileId);
            }}>Delete</Button>
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
          documentSearch: "",
          showFileUploadModal: false,
          documents: []
        }

        this.toggleShowFileUploadModal = this.toggleShowFileUploadModal.bind(this);
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.fetchUserFiles = this.fetchUserFiles.bind(this);
    }

    componentDidMount(){
      fileService.getAllUserFiles()
                 .then(data=>{
                   this.setState(prevState => ({
                     ...prevState,
                     documents: data
                   }))
                 })
                 .catch(error=>console.log(error));
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

    fetchUserFiles(){
      fileService.getAllUserFiles()
                 .then(data=>{
                   this.setState(prevState => ({
                     ...prevState,
                     documents: data
                   }))
                 })
                 .catch(error=>console.log(error));
    }

    deleteFile(file_id){
      fileService.deleteFile(file_id)
      .then(()=>{

        return Promise.resolve(fileService.getAllUserFiles())
      })
      .then(data=>{

        this.setState(prevState=> ({
            ...prevState,
            documents: data
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
            <Navbar bg="white">
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Select className="filter-select" placeholder="Document type" options={ filterOptions } onChange={this.selectOption.bind(this, 'documentFilter')} />
                </Nav>
                <Form inline>
                  <FormControl name="documentSearch" type="text" placeholder="Search Documents" className="mr-sm-2" value={this.state.documentSearch} onChange={this.onChangeHandler}/>
                  <Button variant="outline-primary">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Navbar>
            <Table responsive className="files-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th className="col_4">File Size</th>
                  <th className="col_5">Date Uploaded</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.documents.map((document, index)=>{
                  if(this.state.documentFilter === 'All' && document.file_name.toLowerCase().includes(this.state.documentSearch.toLowerCase())){
                    return (<Document key={document.file_id} fileId={document.file_id} documentNo={index + 1} fileName={document.file_name} fileType={document.file_type} fileSize={document.file_size} dateUploaded={document.date_uploaded} deleteFile={this.deleteFile} fetchUserFiles={this.fetchUserFiles}/>)
                  }else if(this.state.documentFilter === document.file_type && document.file_name.toLowerCase().includes(this.state.documentSearch.toLowerCase())){
                    return (<Document key={document.file_id} fileId={document.file_id} documentNo={index + 1} fileName={document.file_name} fileType={document.file_type} fileSize={document.file_size} dateUploaded={document.date_uploaded} deleteFile={this.deleteFile} fetchUserFiles={this.fetchUserFiles}/>)
                  }
                })}
              </tbody>
            </Table>

            <Modal show={this.state.showFileUploadModal} onHide={this.toggleShowFileUploadModal}>
              <Modal.Header closeButton>
                <Modal.Title>Upload a new document</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Formik
                  initialValues={{
                    file: null,
                    fileType: '',
                    fileRename: ''
                  }}
                  validationSchema={Yup.object().shape({
                      file: Yup.mixed().required('File is required'),
                      fileType: Yup.string().required('File type is required'),
                      fileRename: Yup.string()
                  })}
                  onSubmit={({file, fileType, fileRename}, { setStatus, setSubmitting })=>{
                    fileService.uploadFile(file, fileType, fileRename)
                    .then(()=>{
                      this.toggleShowFileUploadModal()
                      this.fetchUserFiles();
                    })
                    .catch(error=>{
                      console.log(error);
                    })
                  }}
                  render={({
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                    setFieldValue,
                    setFieldTouched
                  })=>(
                    <FForm>
                      <div className="form-group files color">
                        <input type="file" className="form-control" onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }}/>
                      </div>
                      {errors.file && touched.file && (
                        <div
                          style={{ color: "#dc3545",  fontSize:"80%", position: "absolute", top: "10px" }}
                        >
                          {errors.file}
                        </div>
                      )}
                      <div className="form-options">
                        <span className="modal-label">File Type:</span>
                        <Select className="filter-select modal-select" placeholder="Document type" options={ filterOptions.slice(1,4) } onChange={(option)=>{
                          setFieldValue("fileType", option.value);
                        }} onBlur={()=>setFieldTouched('fileType', true)} />
                        {errors.fileType && touched.fileType && (
                          <div
                            style={{ color: "#dc3545", marginTop: ".25rem", marginLeft: "25px", fontSize:"80%" }}
                          >
                            {errors.fileType}
                          </div>
                        )}
                      </div>
                      <div className="form-options" style={{marginBottom: "30px"}}>
                        <span className="modal-label">Rename:</span>
                        <Field name="fileRename" type="text" className={'filter-select modal-select '+'form-control'} placeholder='Optional' />
                      </div>
                      <Button variant="secondary" className="float-right" onClick={this.toggleShowFileUploadModal}>
                        Close
                      </Button>
                      <Button variant="primary" className="float-right" type="submit">
                        Upload
                      </Button>
                    </FForm>
                  )}
              />
              </Modal.Body>
            </Modal>
          </div>
        )
    }
}


export { DocumentsPage };
