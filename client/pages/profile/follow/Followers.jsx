import { withTracker } from 'meteor/react-meteor-data'

import FollowList from './FollowList.jsx'
import SearchWrapper from '../../../components/SearchWrapper.jsx'

import withMethodData from '../../../components/withMethodData.jsx'

const followersFromAPI = withMethodData((props, done) => {
  const profileId = props.match.params.profileId
  const { limit, filter } = props

  Meteor.call('openwhyd.profile.followers.get', profileId, limit, filter, done);
})

const ProfileFollowers = SearchWrapper(followersFromAPI(FollowList), 'Followers')

export default ProfileFollowers
