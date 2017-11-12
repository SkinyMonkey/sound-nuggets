import React from 'react'

import { ListGroup, ListGroupItem } from 'react-bootstrap'

import withMethodData from '../../components/withMethodData.jsx'

const SIDE_MENU_ENTRY = ['tracks', 'playlists', 'following', 'followers']

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

// TODO : avoid rerender or call each time,
//        do this call in Profile to avoid redoing it
//        if pb if openwhyd, would be pb with other backend
const SideMenu = ({ profileId, history, stats = {}, location }) => {
  const path = location.pathname.split('/')[location.pathname.split('/').length - 1]

  return (
    <div id='sidemenu'>
      <ListGroup>
        {SIDE_MENU_ENTRY.map((entry, index) => {
          const url = '/profile/' + profileId + '/' + entry
          const selected = window.location.pathname.lastIndexOf(entry) > -1 ?
                           'onit' :
                           'profile-menu-entry'

          return <ListGroupItem className={selected}
            key={entry}
            onClick={() => { history.push(url) }}>
            {capitalize(entry) + ' '}
            {stats[entry]}
          </ListGroupItem>
        })}
      </ListGroup>
    </div>
  )
}

const userFromAPI = withMethodData(({ profileId }, done) => {
  Meteor.call('openwhyd.profile.user.get', profileId, done);
})

const ProfileSideMenu = userFromAPI(SideMenu)

export default ProfileSideMenu
