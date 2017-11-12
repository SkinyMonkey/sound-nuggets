import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactPlayer from 'react-player'
import mousetrap from 'mousetrap'

import { Col, Row } from 'react-bootstrap'

import modalActions from '../actions/modal'
import tracklistActions from '../actions/tracklist'
import playerActions from '../actions/player'

import AddTrack from '../partials/AddTrack.jsx'

function format (seconds) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad (string) {
  return ('0' + string).slice(-2)
}

function Duration ({ className, seconds }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  )
}

class Player extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {volume: 0.8,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      muted: false,
      volumeBeforeMute: 0.8
    }
  }

  pSetState (modifications) {
    return new Promise((resolve) => {
      this.setState(modifications, resolve)
    })
  }

  preventDefault (cb) {
    return (e) => {
      if (e.preventDefault) {
        e.preventDefault()
      } else {
          // internet explorer
        e.returnValue = false
      }
      cb()
    }
  }

  onReady () {
    mousetrap.bind('space', this.preventDefault(this.playPause.bind(this)))
    mousetrap.bind('n', this.next.bind(this))
    mousetrap.bind('p', this.previous.bind(this))
    mousetrap.bind('m', this.mute.bind(this))
  }

  playPause () {
    this.props.playToggle()
  }

  mute () {
    if (this.state.muted) {
      this.setState({ muted: false,
        volume: this.state.volumeBeforeMute })
    } else {
      this.setState({ muted: true,
        volumeBeforeMute: this.state.volume,
        volume: 0 })
    }
  }

  setVolume (e) {
    return this.pSetState({ volume: parseFloat(e.target.value) })
  }

  setPlaybackRate (e) {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }

  onSeekMouseDown (e) {
    this.setState({ seeking: true })
  }

  onSeekChange (e) {
    this.setState({ played: parseFloat(e.target.value) })
  }

  onSeekMouseUp (e) {
    this.setState({ seeking: false })
    this.state.player.seekTo(parseFloat(e.target.value))
  }

  onProgress (state) {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }

  onDuration (duration) {
    this.state.duration = duration
  }

  addTrack () {
    this.props.openModal({
      title: 'Add track',
      partial: AddTrack,
      item: {
        ...this.props.track,
        provider: 'diggaz'
      }})
  }

  next (auto = false) {
    if (this.props.loop && auto === true) {
      return
    }

    if (this.props.index < this.props.playlist.length - 1) {
      this.props.nextTrack()

      if (this.props.index + 1 >= this.props.playlist.length - 1) {
        this.props.loadMore()
      }
    }
  }

  previous () {
    if (this.props.index > 0) {
      this.props.previousTrack()
    }
  }

  loop () {
    this.props.loopToogle()
  }

  volumeIcon () {
    const volume = this.state.volume
    if (volume === 0) {
      return 'off'
    } else if (volume < 0.5) {
      return 'low'
    }
    return 'high'
  }

  render () {
    const { duration, played, playbackRate, volume, muted } = this.state
    const { loop, playing, session, playlist, index } = this.props
    let track = this.props.track

    if (!track) {
      track = {url: '', name: '', owner: ''}
    }

    // FIXME : isolate duration to avoid rerender of the wrapper component each seconds

    const previousDesactivated = !(index > 0)
    const nextDesactivated = !(index < playlist.length - 1)
    const playDesactivated = false

    const playingIcon = playing ? 'pause' : 'play'
    const loopIcon = loop ? 'infinity' : 'loop'
    const ownTrack = session.currentUser && track.owner === session.currentUser._id

    // if there is something in the playlist
    // display the player
    return (<div id='player' style={{display: playlist.length > 0 ? 'block' : 'none' }}>
        <ReactPlayer
          ref={player => { this.state.player = player }}
          className='react-player'
          width={125}
          height={125}
          url={track.url}
          playing={playing}
          muted={muted}
          playbackRate={playbackRate}
          volume={volume}
          loop={loop}
          onReady={this.onReady.bind(this)}
          onEnded={() => { this.next(true) }}

            // FIXME : onError 150
            // music subject to copyright, would you like to remove it?
            // mark track as unavailable : 'copyright'
          onError={e => console.log('onError', e)}
          onProgress={this.onProgress.bind(this)}
          onDuration={duration => this.setState({ duration })}

          config={{
            youtube: {
              preload: true
            },
            soundcloud: {
              clientId: Meteor.settings.public.soundcloud.CLIENT_ID,
              showArtwork: true,
              preload: true
            },
            vimeo: {
              preload: true
            },
            dailymotion: {
              preload: true
            }
          }}
          />

        <div className='container-fluid' id='player-commands'>
          <Row>
            <Col md={2} id='seek-player-commands'>
              <Col md={2} onClick={this.previous.bind(this)} >
                <span className='oi oi-media-step-backward' disabled={previousDesactivated} />
              </Col>
              <Col md={2} onClick={this.playPause.bind(this)}>
                <span className={'oi oi-media-' + playingIcon} disabled={playDesactivated} />
              </Col>
              <Col md={2} onClick={this.next.bind(this)} >
                <span className='oi oi-media-step-forward' disabled={nextDesactivated} />
              </Col>
              <Col md={2} onClick={this.loop.bind(this)}>
                <span className={'oi oi-' + loopIcon} />
              </Col>
              { ownTrack || !session.isAuth ? ''
                    : <Col md={2} onClick={this.addTrack.bind(this)}>
                      <span className='oi oi-plus' />
                    </Col>
                  }
            </Col>

            <Col md={6} id='seek-player-duration'>
              <div id='player-track-duration'>
                <Row>
                  <Col md={1}>
                    <Duration seconds={duration * played} />
                  </Col>

                  <Col id='player-range-seek' md={10}>
                    <input
                      id='player-seek'
                      type='range' min={0} max={1} step='any'
                      ref='playerSeekRef'
                      value={played}
                      onMouseDown={this.onSeekMouseDown.bind(this)}
                      onChange={this.onSeekChange.bind(this)}
                      onMouseUp={this.onSeekMouseUp.bind(this)}
                              />

                  </Col>

                  <Col md={1}>
                    <Duration seconds={duration} />
                  </Col>
                </Row>
              </div>
            </Col>

            <Col md={3} className='player-track-name'>
              <p id='player-track-name'>{track.name}</p>
            </Col>

            <Col md={1} className='playerVolumeButton'>
              <Row>
                <Col md={4} id='seek-volume-commands' onClick={this.mute.bind(this)}>
                  <span className={'oi oi-volume-' + this.volumeIcon()} />
                </Col>
                <Col md={8} id='seek-volume-seek'>
                  <input id='volume-button'
                    type='range'
                    min={0} max={1}
                    step='any'
                    value={volume}
                    onChange={this.setVolume.bind(this)} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>)
  }
}

Player.propTypes = {
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.player
  }
}

const actionProps = {...tracklistActions,
  ...playerActions,
  ...modalActions}

export default connect(mapStateToProps, actionProps)(Player)
