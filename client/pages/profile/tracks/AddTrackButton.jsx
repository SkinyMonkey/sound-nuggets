import React, { Component } from 'react'

import { Button } from 'react-bootstrap'

import { addTrack } from '../../../actions/AddTrack.js'

import PlaylistDropdown from '../../../components/PlaylistDropdown.jsx'

export default class AddTrackButton extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      editDropdown: false,
      playlistId: ''
    }

    this.onClickAddTrack = this.onClickAddTrack.bind(this)
    this.onSelectPlaylist = this.onSelectPlaylist.bind(this)
    this.onSubmitAddTrack = this.onSubmitAddTrack.bind(this)
    this.onCancelAddTrack = this.onCancelAddTrack.bind(this)
  }

  onSubmitAddTrack (event) {
    event.preventDefault()

    addTrack(this.state.playlistId, this.props.track)

    this.setState({editDropdown: false, playlistId: ''})
  }

  onCancelAddTrack (event) {
    this.setState({editDropdown: false, playlistId: '' })
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
        <PlaylistDropdown
          id='addTrackPlaylistDropdown'
          onChange={this.onSelectPlaylist}
          currentValue={this.state.playlistId} />
        <Button type='submit' value='Add' />
        <Button onClick={this.onCancelAddTrack}>Cancel</Button>
      </form>
      : <Button onClick={this.onClickAddTrack}>Add</Button>)
  }
}
