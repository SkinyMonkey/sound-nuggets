import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, FormGroup, ControlLabel } from 'react-bootstrap'

import { addTrack } from '../actions/AddTrack.js'

import PlaylistDropdown from '../components/PlaylistDropdown.jsx'

class AddTrack extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistId: '',
      playlistName: ''
    }
  }

  // User selected a playlist from the playlist list
  onSelectPlaylist (playlistId, playlistName) {
    this.setState({ playlistId, playlistName })
  }

  // User choose to send like this
  onTrackSubmit (event) {
    event.preventDefault()

    addTrack(this.state.playlistId, this.state.playlistName, this.props.item)

    this.props.closeModal()
  }

  render () {
    return <form onSubmit={this.onTrackSubmit.bind(this)}>
      <FormGroup>
        <ControlLabel>Choose a playlist</ControlLabel>
        <PlaylistDropdown
          id={'playlistDropdown'}
          onSelect={this.onSelectPlaylist.bind(this)}
          currentValue={this.state.playlistId} />
      </FormGroup>

      <ButtonGroup>
        <Button type='submit' bsStyle='success'>Add track</Button>
        <Button onClick={this.props.closeModal}>Cancel</Button>
      </ButtonGroup>
    </form>
  }
}

AddTrack.propTypes = {
  item: PropTypes.object.isRequired,
}

export default AddTrack
