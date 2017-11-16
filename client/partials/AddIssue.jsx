import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class AddIssue extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      username: '',
      title: '',
      issue: '',
      issueUrl: '',
    }
  }

  handleChange(field) {
    return ({target}) => {
      this.setState({[field]: target.value})
    }
  }

  onIssueSubmit (event) {
    event.preventDefault()

    return new Promise((resolve) => {
      return Meteor.call('github.issue.post'
                        ,this.state.username + ' - ' + this.state.title
                        ,this.state.issue, (err, data) => {
                          if (err) return reject(err)
                          resolve(data)
                        })
    })
    .then((issueUrl) => {
      this.setState({ issueUrl })
    })
    .catch(console.error)
  }

  closeModal() {
    this.setState({
      username: '',
      title: '',
      issue: '',
      issueUrl: ''
    })
    this.props.closeModal()
  }

  render () {
    return this.state.issueUrl ?
        <div>
        <p>
          Thank you for reporting this issue!<br/>
          The following link will allow you see the issue you posted, comment it and read the developpers answer :<br/>
          <a href={this.state.issueUrl}>See the issue</a>
        </p>
        <Button onClick={this.closeModal.bind(this)}>Cancel</Button>
        </div>
      :
      <form onSubmit={this.onIssueSubmit.bind(this)}>
      <FormGroup>
        <ControlLabel>What is your openwhyd username?</ControlLabel>
        <FormControl
            type="text"
            value={this.state.username}
            placeholder="Enter text"
            onChange={this.handleChange('username')}
            />
        <ControlLabel>What is your issue named?</ControlLabel>
        <FormControl
            type="text"
            value={this.state.title}
            placeholder="Enter text"
            onChange={this.handleChange('title')}
            />
        <ControlLabel>What's your issue?</ControlLabel>
        <FormControl
            type="textarea"
            value={this.state.issue}
            placeholder="Enter text"
            onChange={this.handleChange('issue')}
            />
      </FormGroup>

      <ButtonGroup>
        <Button type='submit' bsStyle='success'>Send Issue</Button>
        <Button onClick={this.closeModal.bind(this)}>Cancel</Button>
      </ButtonGroup>
    </form>
  }
}

AddIssue.propTypes = {
  item: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired
}

export default AddIssue
