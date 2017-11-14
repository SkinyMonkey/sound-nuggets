import { connect } from 'react-redux'

import TrackList from './TrackList.jsx'
import Container from '../../../components/Container.jsx'
import SearchWrapper from '../../../components/SearchWrapper.jsx'

import withMethodData from '../../../components/withMethodData.jsx'

const tracksFromAPI = withMethodData((props, done) => {
  const profileId = props.match.params.profileId
  const { limit, filter } = props

  const cookie = document.cookie

  Meteor.call('openwhyd.profile.stream.get', limit, cookie, done);
})

// TODO : replace SearchWrapper with a dumb one
const Stream = SearchWrapper(tracksFromAPI(TrackList), 'Stream')

function mapStateToProps (state, ownProps) {
  return {
    ...state.tracklist
  }
}

export default connect(mapStateToProps)(Stream)
