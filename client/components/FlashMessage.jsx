import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const FlashMessage = ({flashMessage, type}) => {
  return (!flashMessage ? null
          : <Alert bsStyle={type}>
            <p>{flashMessage}</p>
          </Alert>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    flashMessage: state.flashMessages.message,
    type: state.flashMessages.type
  }
}

export default connect(mapStateToProps)(FlashMessage)
