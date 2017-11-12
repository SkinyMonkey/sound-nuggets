import { connect } from 'react-redux'

import TrackList from './TrackList.jsx'
import SearchWrapper from '../../../components/SearchWrapper.jsx'

import withMethodData from '../../../components/withMethodData.jsx'

const tracksFromAPI = withMethodData((props, done) => {
  const profileId = props.match.params.profileId
  const { limit, filter } = props

  Meteor.call('openwhyd.profile.tracks.get', profileId, limit, filter, done);
})

const ProfileTracks = SearchWrapper(tracksFromAPI(TrackList), 'Tracks')

function mapStateToProps (state, ownProps) {
  return {
    ...state.tracklist
  }
}

export default connect(mapStateToProps)(ProfileTracks)
