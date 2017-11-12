import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'

import { Col } from 'react-bootstrap'

import Authenticated from '../../components/Authenticated'

import ProfileSideMenu from './SideMenu'

import ProfileTracks from './tracks/Tracks.jsx'
import ProfilePlaylists from './playlists/Playlists.jsx'
import ProfileFollowers from './follow/Followers.jsx'
import ProfileFollowing from './follow/Following.jsx'
import ProfileHeader from './Header.jsx'
import PlaylistTracks from './tracks/PlaylistTracks.jsx'

const SessionPropsWrapper = (session, profile) => {
  return (component) => {
    return (props) => {
      return React.createElement(component
                                , {session, profile, ...props})
    }
  }
}

const Profile = ({ session, match, history, location, profile }) => {
  const profileId = match.params.profileId

  const SessionWrapper = SessionPropsWrapper(session, profile)

  return <div className='mainAppContainer'>
    <ProfileHeader profile={profile} session={session} />
    <div className='container'>
      <Col md={3} >
        <ProfileSideMenu profileId={profileId} history={history} location={location} />
      </Col>

      <Col md={7} >
        <div id='page'>
          <Switch>
            <Route path='/profile/:profileId/playlists/:playlistId'
              component={SessionWrapper(PlaylistTracks)} />

            <Route path='/profile/:profileId/tracks'
              component={SessionWrapper(ProfileTracks)} />

            <Route path='/profile/:profileId/playlists'
              component={SessionWrapper(ProfilePlaylists)} />

            <Route path='/profile/:profileId/followers'
              component={SessionWrapper(ProfileFollowers)} />

            <Route path='/profile/:profileId/following'
              component={SessionWrapper(ProfileFollowing)} />

            <Redirect from='/profile/:profileId'
              to={'/profile/' + profileId + '/tracks'} />
          </Switch>
        </div>
      </Col>
    </div>
  </div>
}

export default withTracker(({ match, session }) => {
  const profileId = match.params.profileId

  // TODO : replace by a method call?
  const profile = Meteor.users.findOne({ _id: profileId }, { fields: {profile: true}}) || { profile : {} }

  return {
    profile,
    profileId,
    session
  }
})(Profile)
