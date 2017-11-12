import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

class Confirm extends Component {
  render () {
    const className = this.props.buttonClass || 'info'

    return <form onSubmit={this.props.callback}>
      <Button type='submit' bsStyle={className}>{this.props.text}</Button>
      <Button onClick={this.props.closeModal}>Cancel</Button>
    </form>
  }
}

Confirm.propTypes = {
  callback: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  buttonClass: PropTypes.string
}

export default Confirm
