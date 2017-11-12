import React from 'react'

import Playlist from './Playlist.jsx'

import { Media } from 'react-bootstrap'

const PlaylistList = ({ playlists, profileId, session }) => {
  return (playlists.length > 0
          ? <div id='playlists'>
            <Media.List>
              {playlists.map((playlist) => (
                <Playlist key={playlist._id}
                  playlist={playlist}
                  profileId={profileId}
                  session={session}
                        />
            ))}
            </Media.List>
          </div>
          : <p>No Playlists yet</p>)
}

export default PlaylistList
