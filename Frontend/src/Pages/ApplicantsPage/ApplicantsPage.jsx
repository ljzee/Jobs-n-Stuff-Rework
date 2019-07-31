import React from 'react';
import './Applicants.css';
import {Card, Button, ToggleButtonGroup, ToggleButton, InputGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const applicantsFilter = ['New','Accepted','Saved','Rejected'];

class ApplicantsPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      filters: []
    }

    this.toggleFilter = this.toggleFilter.bind(this);
    this.createFilterButtons = this.createFilterButtons.bind(this);
  }

  toggleFilter(filter){
    this.setState({filters: filter})
  }

  createFilterButtons(){
    return applicantsFilter.map((filter, index) => <ToggleButton key={index} variant="light" value={filter}>{filter}</ToggleButton>)
  }

  render(){
    let formattedJobTitle = this.props.location.state.title.replace(/\s+/g, '-').replace(/\//, '-').toLowerCase();
    const link = <Link style={{color: "#007bff"}} to={{pathname: `/managepostings/${formattedJobTitle}`, state: {id: this.props.location.state.id, edit: false}}}>{this.props.location.state.title}</Link>
    return (
      <div>
        <h2 className="applicantspage-title"><Link style={{color: "black"}} to={{pathname: `/managepostings/${formattedJobTitle}`, state: {id: this.props.location.state.id, edit: false}}}>{this.props.location.state.title}</Link> - Applicants</h2>
        <div className="applicantspage-toggle">
          <FormControl
            placeholder="Search by name"
          />
          <ToggleButtonGroup type="checkbox" onChange={this.toggleFilter}>
            {this.createFilterButtons()}
          </ToggleButtonGroup>
        </div>

        {(this.state.filters.includes('New') || !this.state.filters.length) &&
          <div>
            <h4 className="candidates-title">New Applicants</h4>
            <div className="candidates-container">
              <Card className="candidate-card">
              <div className="candidate-card-upper">
                <span className="candidate-card-upper-helper">
                </span>
                <img src={require('../../Images/profile-icon.png')}/>
              </div>
              <div className="candidate-card-name"><span>Louis Zhuo</span></div>
              <div className="candidate-card-contact">
                <div><img src={require('../../Images/phone.png')}/>777-777-7777</div>
                <div><img src={require('../../Images/email.png')}/>Louis@sfu.ca</div>
              </div>
              <div className="candidate-card-buttons">
                <Button variant="link">Download Package</Button>
                <Button variant="link">View Profile</Button>
              </div>
              <div className="candidate-card-options">
                <Button variant="success">Accept</Button>
                <Button variant="warning">Save</Button>
                <Button variant="danger">Reject</Button>
              </div>
              </Card>
              <Card className="candidate-card">
              </Card>
              <Card className="candidate-card">
              </Card>
              <Card className="candidate-card">
              </Card>
              <Card className="candidate-card">
              </Card>
              <Card className="candidate-card">
              </Card>
            </div>
          </div>
        }

        {(this.state.filters.includes('Accepted') || !this.state.filters.length) &&
          <div>
            <h4 className="candidates-title">Accepted Applicants</h4>
            <div className="candidates-container">
            </div>
          </div>
        }

        {(this.state.filters.includes('Saved') || !this.state.filters.length) &&
          <div>
            <h4 className="candidates-title">Saved Applicants</h4>
            <div className="candidates-container">
            </div>
          </div>
        }

        {(this.state.filters.includes('Rejected') || !this.state.filters.length) &&
          <div>
            <h4 className="candidates-title">Rejected Applicants</h4>
            <div className="candidates-container">
            </div>
          </div>
        }

      </div>
    )
  }
}

export {ApplicantsPage}
