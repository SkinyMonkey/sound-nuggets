import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, FormControl, FormGroup, ControlLabel } from 'react-bootstrap'

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

export default AddPlaylist
