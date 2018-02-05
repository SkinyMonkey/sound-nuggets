import { connect } from 'react-redux'

import TrackList from './TrackList.jsx'

import searchWrapper from '../../../components/SearchWrapper.jsx'
import withMethodData from '../../../components/withMethodDataRedux.jsx'

import { loadTracklist } from '../../../actions/tracklist.js'

const getData = (props, done) => {
  const profileId = props.match.params.profileId
  const playlistId = props.match.params.playlistId
  const { limit, filter } = props

  Meteor.call('openwhyd.profile.playlists.tracks.get', profileId, playlistId, limit, filter, done);
}

// TODO : Replace searchWrapper with dumb header..
const tracksFromAPI = withMethodData(getData, loadTracklist)

const DISABLED = true

const PlaylistTracks = searchWrapper(tracksFromAPI(TrackList), 'Tracks', DISABLED)

function mapStateToProps (state, ownProps) {
  return state.tracklist
}

export default connect(mapStateToProps)(PlaylistTracks)
