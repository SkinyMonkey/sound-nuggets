import { Playlists } from '../../../../imports/api/playlists.js'

import withMethodData from '../../../components/withMethodData.jsx'

import PlaylistList from './PlaylistList.jsx'
import addPlaylistWrapper from './AddPlaylistWrapper.jsx'

// TODO : like SideMenu, get data from profile to avoid request
const playlistsFromAPI = withMethodData((props, done) => {
  const profileId = props.match.params.profileId

  Meteor.call('openwhyd.profile.playlists.get', profileId, done);
})

const ProfilePlaylists = addPlaylistWrapper(playlistsFromAPI(PlaylistList), 'Playlists')

export default ProfilePlaylists
