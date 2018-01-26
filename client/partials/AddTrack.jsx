import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Button, ButtonGroup, FormGroup, ControlLabel, Media } from 'react-bootstrap'

// TODO : add to connect too?
import { addTrack } from '../actions/AddTrack.js'
import playerActions from '../actions/player'

import PlaylistDropdown from '../components/PlaylistDropdown.jsx'

class AddTrack extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistId: '',
      playlistName: ''
    }
    
    this.onAddToCurrentPlaylist = this.onAddToCurrentPlaylist.bind(this)
  }

  onAddToCurrentPlaylist () {
    if (!this.props.isCurrentTrack) {
      this.props.loadPlaylist({
        playlist: [this.props.item],
        url: this.props.item.url,
        tracklistURL: '/',
        playing: true
      })
    } else {
      this.props.playToggle()
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
    const playingIcon = this.props.isCurrentTrack && this.props.playing ?
                        'status pause' :
                        'status play'

    return <form id='add-track' onSubmit={this.onTrackSubmit.bind(this)}>
      <Media.Left>
        <span className={playingIcon} />
        <img src={this.props.item.image} alt='Track image' onClick={this.onAddToCurrentPlaylist}/>
      </Media.Left>
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

const actionProps = {
  ...playerActions
};

const mapStateToProps = (state, ownProps) => {
  const isCurrentTrack = ownProps.item._id === state.player.track._id

  return {
    playing: state.player.playing,
    isCurrentTrack
  }
}

export default connect(mapStateToProps, actionProps)(AddTrack)
