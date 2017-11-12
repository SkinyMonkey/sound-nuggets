import { withTracker } from 'meteor/react-meteor-data'
import { connect } from 'react-redux'

import { Tracks } from '../../../../imports/api/tracks.js'
import { Follows } from '../../../../imports/api/follows.js'

import TrackList from './TrackList.jsx'

import Container from '../../../components/Container.jsx'
import searchWrapper from '../../../components/SearchWrapper.jsx'

const removeDoubles = (trackSet, userId) => {
  // FIXME : Maybe there's a way to do that in mongo directly?
  //         a 'unique on'?
  //         unique pair

  // Remove the entry of the same url if not owned by the user
  return trackSet.reduce((result, track) => {
    // Did we find the same entry in the track list?
    const foreignTrackIndex = result.findIndex((t) => {
      return t.url === track.url
    })

    // We did not find it
    if (foreignTrackIndex === -1) {
      result.push(track)
    } else if (track.owner === userId) { // Is this other track owned by the user
      result.splice(foreignTrackIndex, 1)
      result.push(track)
    }
    return result
  }, [])
}

const Stream = Container(searchWrapper(withTracker(({ match, session, filter, limit, pristine }) => {
  const userId = session.currentUser ? session.currentUser._id : ''
  const profileId = userId

  // FIXME use lookup?
  const subscriptions = Follows.find({ owner: userId }
                                    , { sort: { createdAt: -1 }, limit })
                                    .fetch()

  const subscriptionsIds = subscriptions.map((s) => s.followed)
                                         .concat(userId)

  let findCriterias = { owner: { $in: subscriptionsIds } }

  if (filter) {
    findCriterias.name = { $regex: filter }
  }

  const total = Tracks.find(findCriterias).count()
  let tracks = Tracks.find(findCriterias
                            , { sort: { createdAt: -1 }, limit })
                            .fetch()

  return {
    tracks: tracks.length > 0 ? removeDoubles(tracks, userId) : tracks,
    total,
    profileId,
    session,
    limit,
    pristine
  }
})(TrackList), 'Stream'))

function mapStateToProps (state, ownProps) {
  return state.tracklist
}

export default connect(mapStateToProps)(Stream)
