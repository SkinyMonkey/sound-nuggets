import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Button, ButtonGroup, FormControl, FormGroup, ControlLabel } from 'react-bootstrap'

import flashMessagesActions from '../actions/flash_messages'

class AddPlaylist extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistName: ''
    }
  }

  onNameChange (event) {
    this.setState({ playlistName: event.target.value })
  }

  onSubmitName (event) {
    event.preventDefault()
    Meteor.call('openwhyd.profile.playlists.post', this.state.playlistName, document.cookie)

    this.props.flashSuccess('Playlist added')
    setTimeout(() => {
        this.props.clearFlashMessage()
    }, 5000)

    this.props.closeModal()
  }

  render () {
    return <form onSubmit={this.onSubmitName.bind(this)}>
      <FormGroup>
        <ControlLabel>Write the name of the new playlist</ControlLabel>
        <FormControl type='text' onChange={this.onNameChange.bind(this)}
          value={this.state.playlistName} />
      </FormGroup>

      <ButtonGroup>
        <Button type='submit' bsStyle='success'>Add Playlist</Button>
        <Button onClick={this.props.closeModal}>Cancel</Button>
      </ButtonGroup>
    </form>
  }
}

AddPlaylist.propTypes = {
  session: PropTypes.object.isRequired
}

// TODO : use redux form?

const actionProps = {
  ...flashMessagesActions,
}

export default connect(null, actionProps)(AddPlaylist)
