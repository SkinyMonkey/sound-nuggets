import { connect } from 'react-redux'

import TrackList from './TrackList.jsx'
import withMethodData from '../../components/withMethodData.jsx'

/*
** TODO : Add genre menu
*/

const tracksFromAPI = withMethodData((props, done) => {
  const genre = props.match.params.genre
  const { limit } = props

  Meteor.call('openwhyd.profile.tracks.hot.get', limit, genre, done);
})

const HotTracks = tracksFromAPI(TrackList)

function mapStateToProps (state, ownProps) {
  return {
    ...state.tracklist
  }
}

export default connect(mapStateToProps)(HotTracks)
