import { withTracker } from 'meteor/react-meteor-data'

import FollowList from './FollowList.jsx'
import SearchWrapper from '../../../components/SearchWrapper.jsx'

import withMethodData from '../../../components/withMethodData.jsx'

const followedFromAPI = withMethodData((props, done) => {
  const profileId = props.match.params.profileId
  const { limit, filter } = props

  Meteor.call('openwhyd.profile.following.get', profileId, document.cookie, limit, filter, done);
})

const ProfileFollowing = SearchWrapper(followedFromAPI(FollowList), 'Following')

export default ProfileFollowing
