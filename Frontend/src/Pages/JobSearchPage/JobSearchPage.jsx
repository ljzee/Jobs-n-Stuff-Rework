import React from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {Form, Button, ListGroup, Card, Pagination} from 'react-bootstrap';
import './JobSearch.css'
import JobCard from './JobCard'
import {LocationPicker} from '@/_components';
import {userService} from '@/_services';

const styles = {
  control: base => ({
    ...base,
    minHeight: 36
}),
dropdownIndicator: base => ({
    ...base,
    padding: 4
}),
clearIndicator: base => ({
    ...base,
    padding: 4
}),
multiValue: base => ({
    ...base,
    backgroundColor: variables.colorPrimaryLighter
}),
valueContainer: base => ({
    ...base,
    padding: '0px 6px'
}),
input: base => ({
    ...base,
    margin: 0,
    padding: 0
}),
  container: base => ({
    ...base,
    flex: 1
  })
};

const quantityOptions = [5, 10, 20, 30];

class JobSearchPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      quantity: 5,
      country: '',
      region: '',
      city: '',
      search: '',
      prevSearch: '',
      jobPosts: []
    }
    this.setQuantityOptions = this.setQuantityOptions.bind(this);
    this.setLocationFieldValue = this.setLocationFieldValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }

  componentDidMount(){
    this.submitSearch();
  }

  setQuantityOptions(quantity){
    this.setState({
      quantity: quantity
    })
  }

  setLocationFieldValue(selector, value){
    if(selector === 'country'){
      this.setState({
        country: value,
        region: '',
        city: ''
      })
    }else if(selector === 'region'){
      this.setState({
        region: value,
        city: ''
      })
    }else{
      this.setState({
        city: value
      })
    }
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submitSearch(){
    userService.searchJobPost(this.state.search, this.state.country, this.state.region, this.state.city)
               .then(data => {this.setState((prevState) => {return {jobPosts: data, prevSearch: prevState.search}})})
               .catch(error=>{console.log(error)})
  }

  handlePaginationChange(e){
    console.log(e.target.text)
  }

  render(){


    return(
      <div className="job-search-page mx-auto">
        <h3 className="job-search-page-title">Search Jobs</h3>
        <Form className="job-search-page-search-container">
          <Form.Group>
            <Button variant="primary" onClick={this.submitSearch}>Search Jobs</Button>
            <Form.Control name="search" onChange={this.handleChange} type="text" placeholder="Search job title or company" />

            <LocationPicker setFieldValue={this.setLocationFieldValue}>
            {({countryOptions, regionOptions, cityOptions, country, region, city, handleChange}) => (
              <div className="location-selector-container">
                <div className="select-wrapper">
                  <Select name="country" options={countryOptions} value={country} onChange={handleChange} placeholder="Country" styles={styles}/>
                </div>
                <div className="select-wrapper">
                  <Select name="region" options={regionOptions} value={region} onChange={handleChange} placeholder="State" styles={styles}/>
                </div>
                <div className="select-wrapper">
                  <Select name="city" options={cityOptions} value={city} onChange={handleChange} placeholder="City" styles={styles}/>
                </div>
              </div>
            )}
            </LocationPicker>
          </Form.Group>
        </Form>

        <div>
          <div className="job-results">
            <span className="job-results-quantity">
              {this.state.prevSearch === "" && <React.Fragment><b>{this.state.jobPosts.length}</b> total jobs</React.Fragment>}
              {this.state.prevSearch !== "" && <React.Fragment><b>{this.state.jobPosts.length}</b> jobs found for <b>"{this.state.prevSearch}"</b></React.Fragment>}
            </span>
            <span className="job-results-quantity-select">
              Results per page: {quantityOptions.map(option => <span key={option}><a onClick={()=>{
                this.setQuantityOptions(option);
              }}>{option}</a></span>)}
            </span>
          </div>

          <div className="job-container">
            {this.state.jobPosts.map(job => (<JobCard
                                                key={job.id}
                                                jobId={job.id}
                                                title={job.title}
                                                positionType={job.position_type}
                                                companyName={job.company_name}
                                                datePublished={job.date_published}
                                                description={job.description}
                                                state={job.state}
                                                city={job.city}
                                             />))
            }
          </div>
          <Pagination onClick={this.handlePaginationChange} size="md">
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      </div>
    )
  }
}

export {JobSearchPage}
