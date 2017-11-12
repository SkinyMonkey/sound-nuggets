import React from 'react'

import { Media } from 'react-bootstrap'

import Follow from './Follow.jsx'

const FollowList = ({ follows, session, profileId }) => {
  return (
    <div id='follows'>
      <Media.List>
        {follows.length > 0
          ? follows.map((follow) => (
            <Follow key={follow._id}
              follow={follow}
              profileId={profileId}
              session={session} />
          ))
        : <Media.ListItem>
          <p>No follows yet</p>
        </Media.ListItem>}
      </Media.List>
    </div>)
}

export default FollowList
