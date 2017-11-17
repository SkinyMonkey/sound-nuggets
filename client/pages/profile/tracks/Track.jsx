import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Media, Col } from 'react-bootstrap'

import modalActions from '../../../actions/modal.js'
import playerActions from '../../../actions/player.js'

import AddTrack from '../../../partials/AddTrack.jsx'
import EditTrack from '../../../partials/EditTrack.jsx'

// Track component - represents a single track item
class Track extends Component {
  constructor (props, context) {
    super(props, context)

    this.onAddToCurrentPlaylist = this.onAddToCurrentPlaylist.bind(this)
  }

  // TODO : replace button for that?
  onPlayNow () {
    ;
  }

  // TODO : add a button for that?
  //        add a button to play all in playlist or stream etc?
  // FIXME : move into list? how? add an order?
  //         push in front? how?
  onAddToCurrentPlaylist () {
    if (!this.props.isCurrentTrack) {
      this.props.onAddToCurrentPlaylist(this.props.track.url)
    } else {
      this.props.playToggle()
    }
  }

  addTrack (event) {
    event.preventDefault()
    this.props.openModal({
      title: 'Add \'' + this.props.track.name + '\'',
      partial: AddTrack,
      item: {
        ...this.props.track,
        provider: 'sound-nuggets'
      }})
  }

  editTrack () {
    this.props.openModal({
      title: 'Edit \'' + this.props.track.name + '\'',
      partial: EditTrack,
      track: this.props.track
    })
  }

  computeOwnerText (track) {
    const from = track.openwhyd ? '/openwhyd/' : '/profile/'

    let userUrl = <Link key={'userUrl' + track._id}
      to={from + track.owner + '/tracks'}>
      {track.ownerName}</Link>

    let ownerTextContent = [userUrl]

    if (track.playlist) {
      const playlistUrl = <Link key={'playlistUrl' + track._id}
      to={from + track.owner + '/playlists/' + track.playlist}>
      {track.playlistName}
      </Link>

        ownerTextContent.push(' added this track to ')
        ownerTextContent.push(playlistUrl)
    }

    if (track.originalOwner) {
      const ownerUrl = track.openwhyd
                      ? '/openwhyd/' + track.originalOwner + '/tracks'
                      : '/profile/' + track.originalOwner + '/tracks'

      const ownerUrlLink = <Link key={'ownerUrl' + track._id}
        to={ownerUrl}>
        {track.originalOwnerName}
      </Link>
      ownerTextContent.push(' via ')
      ownerTextContent.push(ownerUrlLink)
    }

    return ownerTextContent
  }

  render () {
    const { profileId, track } = this.props
    const user = this.props.session && this.props.session.currentUser
    const ownerTextContent = this.computeOwnerText(track)
    const ownTrack = user && track.owner === user._id
    const isAuth = this.props.session && this.props.session.isAuth
    const playingBorder = this.props.isCurrentTrack ? 'track onit' : 'track'
    const playingIcon = this.props.isCurrentTrack && this.props.playing
                        ? 'status pause'
                        : 'status play'

    const image = track.image || 'https://i.ytimg.com/vi/T0Jqdjbed40/mqdefault.jpg'

    return (
      <Media.ListItem className={playingBorder}>
        <Media.Left>
          <span className={playingIcon} />
          <img width='110' height='110' src={image} alt='Track image' onClick={this.onAddToCurrentPlaylist} />
        </Media.Left>
        <Media.Body>
          <Media.Heading>{track.name}</Media.Heading>
          <Media>
            <Media.Left>
              <Link key={'ownerImage' + track._id}
                to={'/profile/' + track.owner + '/tracks'}>
                <img width={32} height={32} src={track.ownerImage} alt='Owner image' className='img-circle' />
              </Link>
            </Media.Left>
            <Media.Body>
              <p>{ownerTextContent}</p>
            </Media.Body>
          </Media>

          <div>
            { !isAuth ? '' :
              ownTrack ?
              <div className='control'>
                <Col xs={3}>
                  <p onClick={this.editTrack.bind(this)}>
                    <span className='oi oi-pencil' />
                    Edit
                  </p>
                </Col>
              </div>
              : <div className='control'>
                <p onClick={this.addTrack.bind(this)}>
                  <span className='oi oi-plus' />
                  Add track
                </p>
              </div>
            }
          </div>
        </Media.Body>
      </Media.ListItem>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isCurrentTrack = ownProps.track._id === state.player.track._id

  return {
    playing: state.player.playing,
    isCurrentTrack
  }
}

const actionProps = {...modalActions,
  ...playerActions}

export default connect(mapStateToProps, actionProps)(Track)
