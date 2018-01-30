import React from 'react'

import { ListGroup, ListGroupItem } from 'react-bootstrap'

const SIDE_MENU_ENTRY = ['tracks', 'playlists', 'following', 'followers']

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

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

export default SideMenu
