import Soundcloud from 'node-soundcloud'
import { Meteor } from 'meteor/meteor'

if (Meteor.isServer) {
  const SOUNDCLOUD_CLIENT_ID = 'eb257e698774349c22b0b727df0238ad'

  Soundcloud.init({
    id: SOUNDCLOUD_CLIENT_ID
  })

  const soundcloudCall = (url, params) => {
    return new Promise((resolve, reject) => {
      Soundcloud.get(url, params, (err, data) => {
        if (err) { return console.error(__filename, err) }
        return resolve(data)
      })
    })
  }

  const formatSoundcloudData = (trackData) => {
    return {
      name: trackData.user.username + ' - ' + trackData.title,
      url: trackData.permalink_url,
      image: trackData.artwork_url || trackData.user.avatar_url,
      provider: 'soundcloud',
      type: 'track'
    }
  }

  Meteor.methods({
    'soundcloud.metadata' (url) {
      return soundcloudCall('/resolve', {url})
                           .then((soundcloudData) => {
                             return formatSoundcloudData(soundcloudData)
                           })
    },

    'soundcloud.search' (keywords, limit) {
      return soundcloudCall('/tracks', {q: keywords, limit })
              .then((soundcloudSearch) => {
                return soundcloudSearch.map(formatSoundcloudData)
              })
    }
  })
}
