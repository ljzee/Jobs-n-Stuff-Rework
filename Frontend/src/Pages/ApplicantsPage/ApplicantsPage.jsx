import React from 'react';
import './Applicants.css';
import {Card, Button, ToggleButtonGroup, ToggleButton, InputGroup, FormControl, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {businessService} from '@/_services';
import {ApplicantCard} from './ApplicantCard';
import randomColor from 'randomColor';
import {ApplicationStatus} from '@/_helpers';

const applicantsFilter = ['New','Accepted','Saved','Rejected'];

class ApplicantsPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      filters: [],
      applicants: [],
      loading: true
    }

    this.toggleFilter = this.toggleFilter.bind(this);
    this.createFilterButtons = this.createFilterButtons.bind(this);
  }

  componentDidMount(){
    businessService.getJobApplicants(this.props.location.state.id)
                   .then(data => {
                     data.applicants.forEach(applicant => {applicant.color = randomColor(); return applicant})
                     this.setState({applicants: data.applicants, loading: false})})
                   .catch(errpr => console.log(error))

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
    /*
    if(this.state.loading) return(

      <div>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
      </div>
    )
*/
    return (
      <div>
        <h3 className="applicantspage-title"><Link style={{color: "black"}} to={{pathname: `/managepostings/${formattedJobTitle}`, state: {id: this.props.location.state.id, edit: false}}}>{this.props.location.state.title}</Link> - Applicants</h3>
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
            <h5 className="candidates-title">New Applicants</h5>
            <div className="candidates-container">
            {
              this.state.applicants.filter(applicant => applicant.status == ApplicationStatus.New)
                                   .map(applicant => <ApplicantCard key={applicant.id} id={applicant.id} firstName={applicant.first_name} lastName={applicant.last_name} phoneNumber={applicant.phone_number} email={applicant.email} color={applicant.color}/>)
            }
            </div>
          </div>
        }

        {(this.state.filters.includes('Accepted') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">Accepted Applicants</h5>
            <div className="candidates-container">
            {
              this.state.applicants.filter(applicant => applicant.status == ApplicationStatus.Accepted)
                                   .map(applicant => <ApplicantCard key={applicant.id} id={applicant.id} firstName={applicant.first_name} lastName={applicant.last_name} phoneNumber={applicant.phone_number} email={applicant.email} color={applicant.color}/>)
            }
            </div>
          </div>
        }

        {(this.state.filters.includes('Saved') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">Saved Applicants</h5>
            <div className="candidates-container">
            {
              this.state.applicants.filter(applicant => applicant.status == ApplicationStatus.Saved)
                                   .map(applicant => <ApplicantCard key={applicant.id} id={applicant.id} firstName={applicant.first_name} lastName={applicant.last_name} phoneNumber={applicant.phone_number} email={applicant.email} color={applicant.color}/>)
            }
            </div>
          </div>
        }

        {(this.state.filters.includes('Rejected') || !this.state.filters.length) &&
          <div>
            <h5 className="candidates-title">Rejected Applicants</h5>
            <div className="candidates-container">
            {
              this.state.applicants.filter(applicant => applicant.status == ApplicationStatus.Rejected)
                                   .map(applicant => <ApplicantCard key={applicant.id} id={applicant.id} firstName={applicant.first_name} lastName={applicant.last_name} phoneNumber={applicant.phone_number} email={applicant.email} color={applicant.color}/>)
            }
            </div>
          </div>
        }

      </div>
    )
  }
}

export {ApplicantsPage}
