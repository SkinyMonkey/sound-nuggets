import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import mousetrap from 'mousetrap'

import tracklistActions from '../../../actions/tracklist'
import playerActions from '../../../actions/player'

import { Media, Button } from 'react-bootstrap'

const BaseTrackList = (ElementComponent) => {
  return class BaseTrackList extends Component {
    constructor (props, context) {
      super(props, context)

      this.onLoadMoreClick = this.onLoadMoreClick.bind(this)
      this.onAddToCurrentPlaylist = this.onAddToCurrentPlaylist.bind(this)
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
  
    currentTracklistURL() {
      const { pathname, search } = window.location;
      return pathname + search
    }
  
    componentWillMount () {
      this.props.load()
  
      if (this.props.pristine === true) {
        mousetrap.bind('space', (event) => {
          event.preventDefault()
          this.onAddToCurrentPlaylist(this.props.tracks[0].url)
        })
      }
  
      // Is the player is active
      if (this.props.pristine === false &&
          this.props.tracklistURL === this.currentTracklistURL()) {
        this.props.loadPlaylist({playlist: this.props.tracks})
      }
    }
  
    componentWillReceiveProps (newProps) {
      // TODO : understand the isLoading condition:
      //        found by accident, not needed when not using the openwhyd api ..
      //        isLoading is badly named : it means that a request was sent by withMethodData
  
      // Is the player is active
      if (this.props.pristine === false &&
          this.props.isLoading &&
          newProps.tracks.length &&
          newProps.tracklistURL === this.currentTracklistURL()) {
        this.props.loadPlaylist({playlist: newProps.tracks})
      }
    }
  
    // Called when you click on a track
    // to play it
    onAddToCurrentPlaylist (url) {
      const index = this.props.tracks.findIndex((track) => {
        return url === track.url
      })
  
      if (index === -1) {
        return
      }
  
      const loadMoreIfEnd = () => {
        if (index >= this.props.tracks.length - 1) {
          this.props.loadMore()
        }
      }
  
      // If the player wasn't used
      // or if we changed trackList
      if (this.props.pristine === true ||
          this.props.tracklistURL !== this.currentTracklistURL()) {
        this.props.setPristine(false)
            .then(() => {
              this.props.loadPlaylist({
                playlist: this.props.tracks,
                url,
                tracklistURL: this.currentTracklistURL(),
                playing: true
              })
            })
            .then(() => {
              loadMoreIfEnd()
            })
            .catch(console.error)
      } else {
        this.props.playUrl(url)
        loadMoreIfEnd()
      }
    }
  
    onLoadMoreClick () {
      this.props.loadMore()
    }
  
    render () {
      const end = this.props.limit > this.props.tracks.length
  
      return (this.props.tracks.length > 0
        ? <div id='tracks'>
          <Media.List>
            {this.props.tracks.map((track, index) => (
              <ElementComponent key={track._id}
                track={track}
                profileId={this.props.profileId}
                session={this.props.session}
                onAddToCurrentPlaylist={this.onAddToCurrentPlaylist}
                 />
        ))}
          </Media.List>
          {end ? '' : <Button id='load-more' onClick={this.onLoadMoreClick}>Load more</Button>}
        </div>
        : <p>No tracks yet</p>)
    }
  }

  BaseTrackList.propTypes = {
    profileId: PropTypes.string.isRequired,
    session: PropTypes.object.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
    limit: PropTypes.number.isRequired
  }
}

export default BaseTrackList
