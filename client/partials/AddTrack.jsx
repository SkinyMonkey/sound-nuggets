import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, FormGroup, ControlLabel } from 'react-bootstrap'

import { addTrackFromUser, addTrack } from '../actions/AddTrack.js'

import PlaylistDropdown from '../components/PlaylistDropdown.jsx'

class AddTrack extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistId: this.props.session.defaultPlaylist._id
    }
  }

  // User selected a playlist from the playlist list
  onSelectPlaylist (playlistId) {
    this.setState({ playlistId })
  }

  // User choose to send like this
  onTrackSubmit (event) {
    event.preventDefault()

    if (this.props.item.provider === 'diggaz') {
      addTrackFromUser(this.props.session
                      , this.state.playlistId
                      , this.props.item)
    } else if (this.props.item.type === 'track') {
      addTrack(this.props.session
              , this.state.playlistId
              , this.props.item)
    }

    this.props.closeModal()
  }

  render () {
    return <form onSubmit={this.onTrackSubmit.bind(this)}>
      <FormGroup>
        <ControlLabel>Choose a playlist</ControlLabel>
        <PlaylistDropdown profileId={this.props.session.currentUser._id}
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
  session: PropTypes.object.isRequired
}

export default AddTrack
