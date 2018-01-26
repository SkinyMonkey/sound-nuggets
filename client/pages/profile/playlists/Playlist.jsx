import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Media, Col } from 'react-bootstrap'

import modalActions from '../../../actions/modal.js'
import EditPlaylist from '../../../partials/EditPlaylist.jsx'

// Playlist component - represents a single playlist item
class Playlist extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistName: props.playlist.name
    }
  }

  editPlaylist () {
    this.props.openModal({
      title: 'Edit \'' + this.props.playlist.name + '\'',
      partial: EditPlaylist,
      playlist: this.props.playlist
    })
  }

  generateControl (profileId, playlist) {
    return (this.props.session.isAuth &&
            this.props.session.currentUser._id === profileId &&
            playlist.isDefault === false
            ? '' /*<div className='control'>
              <Col xs={3}>
                <p onClick={this.editPlaylist.bind(this)}>
                  <span className='oi oi-pencil' />
                  Edit
                </p>
              </Col>
            </div>*/
          : '')
  }

  render () {
    const {playlist, profileId} = this.props
    const link = '/profile/' + profileId + '/playlists/' + playlist._id

    const playlistControl = this.generateControl(profileId, playlist)

    return (
      <Media.ListItem className='onit'>
        <Media.Left>
          <img
            width='110' height='110'
            src={!playlist.image ? 'https://i.ytimg.com/vi/T0Jqdjbed40/mqdefault.jpg' : playlist.image}
            alt='playlistImage'
          />
        </Media.Left>
        <Media.Body>
          <Media.Heading>
            <Link to={link}>
              {playlist.name}
            </Link>
          </Media.Heading>
          <p>{playlist.tracksNbr} tracks</p>
          {playlistControl}
        </Media.Body>
      </Media.ListItem>
    )
  }
}

const actionProps = {...modalActions}

export default connect(null, actionProps)(Playlist)
