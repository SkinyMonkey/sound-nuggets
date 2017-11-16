export const addTrack = (playlistId, playlistName, track) => {
  const newTrack = {
    ...track,
    playlist: playlistId,
		playlistName
  }

  Meteor.call('openwhyd.profile.tracks.post', newTrack, document.cookie)
}
