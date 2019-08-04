import React from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {Form, Button, ListGroup, Card, Pagination} from 'react-bootstrap';
import './JobSearch.css'

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
    }
    this.setQuantityOptions = this.setQuantityOptions.bind(this);
  }

  setQuantityOptions(quantity){
    this.setState({
      quantity: quantity
    })
  }

  render(){


    return(
      <div className="job-search-page mx-auto">
        <h3 className="job-search-page-title">Search Jobs</h3>
        <Form className="job-search-page-search-container">
          <Form.Group>
            <Button variant="primary">Search Jobs</Button>
            <Form.Control type="text" placeholder="Search job title or company" />
            <div className="location-selector-container">
              <div className="select-wrapper">
              <Select placeholder="Country" styles={styles}/>
              </div>
              <div className="select-wrapper">
              <Select placeholder="State" styles={styles}/>
              </div>
              <div className="select-wrapper">
              <Select placeholder="City" styles={styles}/>
              </div>
            </div>
          </Form.Group>
        </Form>

        <div>
          <div className="job-results">
            <span className="job-results-quantity">
              <b>213</b> jobs found for <b>'Junior'</b>
            </span>
            <span className="job-results-quantity-select">
              Results per page: {quantityOptions.map(option => <span key={option}><a onClick={()=>{
                this.setQuantityOptions(option);
              }}>{option}</a></span>)}
            </span>
          </div>

          <div className="job-container">
            <Link className="job-card" to="">
              <Card>
                <Card.Body>
                  <button onClick={()=>{console.log('bookmarked')}} className="job-card-bookmark-btn"/>
                  <div className="job-card-title">Junior UX/UI Designer <span>(Full-time)</span></div>
                  <div className="job-card-company-location">Awesome Software - Burnaby, British Columbia</div>
                  <div className="job-card-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi elementum nunc ante, vitae euismod lectus varius nec. In hac habitasse platea dictumst. Ut lacinia a diam viverra fermentum. Nullam semper velit non ultricies lacinia. Phasellus non dolor iaculis, feugiat lectus vel, lobortis sem. Vivamus viverra, libero sit amet porttitor iaculis.</div>
                  <div className="job-card-date-published">Published: 2019-07-24</div>
                </Card.Body>
              </Card>
            </Link>

            <Link className="job-card" to="">
              <Card>
                <Card.Body>
                  <button className="job-card-bookmark-btn"/>
                  <div className="job-card-title">Junior Developer <span>(Part-time)</span></div>
                  <div className="job-card-company-location">Awesome Software - Burnaby, British Columbia</div>
                  <div className="job-card-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi elementum nunc ante, vitae euismod lectus varius nec. In hac habitasse platea dictumst. Ut lacinia a diam viverra fermentum. Nullam semper velit non ultricies lacinia. Phasellus non dolor iaculis, feugiat lectus vel, lobortis sem. Vivamus viverra, libero sit amet porttitor iaculis.</div>
                  <div className="job-card-date-published">Published: 2019-07-24</div>
                </Card.Body>
              </Card>
            </Link>
          </div>
          <Pagination size="md">
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
