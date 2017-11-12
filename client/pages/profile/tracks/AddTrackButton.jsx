import React, { Component } from 'react'

import { Button } from 'react-bootstrap'

import { addTrackFromUser } from '../../../actions/AddTrack.js'

import PlaylistDropdown from '../../../components/PlaylistDropdown.jsx'

export default class AddTrackButton extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      editDropdown: false,
      playlistId: this.props.session.defaultPlaylist._id
    }

    this.onClickAddTrack = this.onClickAddTrack.bind(this)
    this.onSelectPlaylist = this.onSelectPlaylist.bind(this)
    this.onSubmitAddTrack = this.onSubmitAddTrack.bind(this)
    this.onCancelAddTrack = this.onCancelAddTrack.bind(this)
  }

  onSubmitAddTrack (event) {
    event.preventDefault()

    addTrackFromUser(this.props.session
                    , this.state.playlistId
                    , this.props.track)

    this.setState({editDropdown: false,
      playlistId: this.props.session.defaultPlaylist.id})
  }

  onCancelAddTrack (event) {
    this.setState({editDropdown: false,
      playlistId: this.props.session.defaultPlaylist.id})
  }

  onSelectPlaylist (event) {
    this.setState({playlistId: event.target.value})
  }

  // FIXME : display PlaylistDropdown
  onClickAddTrack () {
    this.setState({editDropdown: true})
  }

  render () {
    return (this.state.editDropdown
      ? <form onSubmit={this.onSubmitAddTrack}>
        <PlaylistDropdown profileId={this.props.session.currentUser._id}
          id={'addTrackPlaylistDropdown'}
          onChange={this.onSelectPlaylist}
          currentValue={this.state.playlistId} />
        <Button type='submit' value='Add' />
        <Button onClick={this.onCancelAddTrack}>Cancel</Button>
      </form>
      : <Button onClick={this.onClickAddTrack}>Add</Button>)
  }
}
