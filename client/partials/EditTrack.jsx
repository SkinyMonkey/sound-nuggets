import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, ButtonToolbar, ControlLabel, FormGroup } from 'react-bootstrap'

import Confirm from './Confirm.jsx'

import PlaylistDropdown from '../components/PlaylistDropdown.jsx'

class EditTrack extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistId: this.props.track.playlist,
      playlistName: this.props.track.playlistName
    }
  }

  // User selected a playlist from the playlist list
  onSelectPlaylist (playlistId, playlistName) {
    this.setState({ playlistId, playlistName })
  }

  // User choose to send like this
  onTrackEditSubmit (event) {
    event.preventDefault()

		const { playlistId, playlistName } = this.state

    Meteor.call('openwhyd.profile.tracks.update', this.props.track, playlistId, playlistName, document.cookie)

    this.props.closeModal()
  }

  onDelete () {
    this.props.openModal({
      title: 'Do you really want to remove \'' + this.props.track.name + '\'?',
      partial: Confirm,
      text: 'Remove track',
      buttonClass: 'danger',
      callback: (event) => {
        event.preventDefault()

        Meteor.call('openwhyd.profile.tracks.delete', this.props.track._id, document.cookie)

        this.props.closeModal()
      }
    })
  }

  render () {
    return <form onSubmit={this.onTrackEditSubmit.bind(this)}>
      <FormGroup>
        <ControlLabel>Choose a new playlist</ControlLabel>
        <PlaylistDropdown
          id={'playlistDropdown'}
          onSelect={this.onSelectPlaylist.bind(this)}
          currentValue={this.state.playlistId} />
      </FormGroup>

      <ButtonToolbar>
        <ButtonGroup>
          <Button type='submit' bsStyle='success'>Edit track</Button>
          <Button onClick={this.props.closeModal}>Cancel</Button>
        </ButtonGroup>

        <ButtonGroup className='pull-right'>
          <Button onClick={this.onDelete.bind(this)} className='small-danger'>Delete</Button>
        </ButtonGroup>
      </ButtonToolbar>
    </form>
  }
}

EditTrack.propTypes = {
  track: PropTypes.object.isRequired,
}

export default EditTrack
