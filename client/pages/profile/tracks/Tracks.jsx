import { connect } from 'react-redux'

import TrackList from './TrackList.jsx'
import SearchWrapper from '../../../components/SearchWrapper.jsx'
import withMethodData from '../../../components/withMethodDataToRedux.jsx'

import { loadTracklist } from '../../../actions/tracklist.js'

// Model
// Data retrieve and store in redux state
const getData = (props, done) => {
  const profileId = props.match.params.profileId
  const { limit, filter } = props

  Meteor.call('openwhyd.profile.tracks.get', profileId, limit, filter, done);
}

const tracksFromAPI = withMethodData(getData, loadTracklist)

// View
// Profile tracks component and redux connection
function mapStateToProps (state, ownProps) {
  return {
    ...state.tracklist
  }
}

const ProfileTracks = SearchWrapper(tracksFromAPI(TrackList), 'Tracks')

export default connect(mapStateToProps)(ProfileTracks)
