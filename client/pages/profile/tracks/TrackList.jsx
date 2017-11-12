import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import tracklistActions from '../../../actions/tracklist'
import playerActions from '../../../actions/player'

import Track from './Track.jsx'
import BaseTrackList from './BaseTrackList.jsx'

import { Media, Button } from 'react-bootstrap'

const actionProps = {...tracklistActions,
                     ...playerActions}

const mapStateToProps = (state) => {
  return {
    tracklistURL: state.player.tracklistURL,
    playerPlaylist: state.player.playlist
  }
}

export default connect(mapStateToProps, actionProps)(BaseTrackList(Track))
