import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

const FlashMessage = ({flashMessage, type}) => {
  const style = {
    position: 'fixed',
    width: '100%',
    textAlign: 'center',
    zIndex: 1000
  }

  return (!flashMessage ? null
          : <Alert bsStyle={type} style={style}>
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
