import React from 'react';
import {Tabs, Tab, Card, Nav, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './ManagePostings.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {businessService} from '@/_services';

class ManagePostingsPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: [],
      loading: true
    }
  }

  componentDidMount(){
    businessService.getAllBusinessJobPost()
                   .then(posts => {
                     this.setState({
                       data: posts.map(post => ({position: post.title, location: `${post.city}, ${post.state}`, deadline: post.deadline, applicantsquantity: 5, status: post.status})),
                       loading: false
                     })
                   })
                   .catch(error => {console.log(error)})
  }

  render(){

    const columns = [{
      Header: '#',
      width: 50,
      Cell: (row) => {
        return <div>{row.index+1}</div>
      },
      style:{
          textAlign: "center"
      },
    },{
      Header: 'Position',
      width: 275,
      Cell: props => {
        return(
          <Link style={{color: "#007bff"}} to='/'>{props.original.position}</Link>
        )
      },
      style:{
          textAlign: "center",
      }
    },{
      Header: 'Location',
      accessor: 'location',
      width: 275,
      style:{
          textAlign: "center"
      }
    },{
      Header: 'Deadline',
      width: 125,
      style:{
          textAlign: "center"
      },
      Cell: props => {
        return(
          <div className="datepicker-container">
            <DatePicker value={props.original.deadline} />
          </div>
        )
      }
    },{
      Header: 'No. of Apps',
      accessor: 'applicantsquantity',
      width: 125,
      style:{
          textAlign: "center"
      }
    },{
      Header: 'Actions',
      accessor: 'actions',
      Cell: props => (
        <div className="action-button-group">
          {props.original.status === 'OPEN' && <button className="action-applicant-button"><img src={require('../../Images/applicant.png')}/></button>}
          <button className="action-edit-button"><img src={require('../../Images/edit.png')}/></button>
          <button className="action-delete-button"><img src={require('../../Images/bin.png')}/></button>
        </div>
      ),
      sortable: false
    }]



    return(
      <div className="managepostings-page mx-auto">
        <Button variant="primary float-right" onClick={()=>{this.props.history.push('/addposting')}}>Create New Posting</Button>
        <h2 className="managepostings-page-title">Manage Postings</h2>
        <Tab.Container defaultActiveKey="active" transition={false}>
          <Card>
            <Card.Header>
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="active">Active Postings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="drafts">Drafts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="past">Past Postings</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="active">
                  <ReactTable columns={columns}
                              data={this.state.data}
                              resolveData={data => data.filter(jobpost => jobpost.status === 'OPEN')}
                              showPagination={false}
                              noDataText={"No job postings found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="drafts">
                  <ReactTable columns={columns}
                              data={this.state.data}
                              resolveData={data => data.filter(jobpost => jobpost.status === 'DRAFT')}
                              showPagination={false}
                              noDataText={"No job postings found"}
                              style={{
                                height: "450px" // This will force the table body to overflow and scroll, since there is not enough room
                              }}
                              className="-striped"
                              loading={this.state.loading}
                              />
                </Tab.Pane>
                <Tab.Pane eventKey="past">past table goes here</Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </div>
    )
  }
}

export {ManagePostingsPage};
