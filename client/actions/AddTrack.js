import { Tracks } from '../../imports/api/tracks.js'
import { Playlists } from '../../imports/api/playlists.js'

// TODO : SET lastUsed TIMESTAMP FOR DROPDOWNS!

// TODO : move to backend method?
export const addTrackFromUser = (session, playlistId, track) => {
  const user = session.currentUser
  const playlist = playlistId === session.defaultPlaylist._id
                                  ? session.defaultPlaylist
                                  : Playlists.findOne({ _id: playlistId })

  let newTrack = Object.assign({}, track)

  delete newTrack._id
  newTrack.createdAt = new Date()
  newTrack.owner = user._id
  newTrack.ownerName = user.username
  newTrack.ownerImage = user.image
  newTrack.playlist = playlist._id
  newTrack.playlistName = playlist.name
  newTrack.originalOwner = track.owner
  newTrack.originalOwnerName = track.ownerName
  newTrack.originalTrack = track.originalTrack
                             ? track.originalTrack
                             : track._id

  Tracks.insert(newTrack)
}

export const addTrack = (session, playlistId, track) => {
  const user = session.currentUser
  const playlist = playlistId === session.defaultPlaylist._id
                                  ? session.defaultPlaylist
                                  : Playlists.findOne({ _id: playlistId })

  // TODO : if url exists, addTrackFromUser?

  Tracks.insert(Object.assign({}, track, {
    createdAt: new Date(), // current time
    owner: user._id,
    ownerName: user.username,
    ownerImage: user.image,
    playlist: playlist._id,
    playlistName: playlist.name
  }))
}
