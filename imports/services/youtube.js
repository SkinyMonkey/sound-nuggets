import Youtube from 'youtube-api'
import { Meteor } from 'meteor/meteor'

// import {parse} as parseUrl from 'url';
// import {parse} as parseQs from 'querystring';

// FIXME : import, not require
const parseUrl = require('url').parse
const parseQs = require('querystring').parse

if (Meteor.isServer) {
  const DEVELOPER_KEY = 'AIzaSyA5TnDGxA5PQzyjdI0dXs-oTC65QfkSWeQ'

  Youtube.authenticate({
    type: 'key',
    key: DEVELOPER_KEY
  })

  const youtubeCall = (ressource, params) => {
    return new Promise((resolve, reject) => {
      Youtube[ressource].list(params, (err, data) => {
        if (err) { console.error(err); throw new Meteor.Error(err) }
        return resolve(data)
      })
    })
  }

  const formatYoutubeData = (trackData) => {
    const id = trackData.id.videoId || trackData.id
    return {
      name: trackData.snippet.title,
      url: 'https://www.youtube.com/watch?v=' + id,
      image: trackData.snippet.thumbnails.default.url,
      provider: 'youtube',
      type: 'track'
    }
  }

  Meteor.methods({
    'youtube.metadata' (url) {
       // We reparse the url on server side as it's not possible
       // to serialize a URL object
      const trackSource = parseUrl(url)
      const id = parseQs(trackSource.query)['v']

      if (id === undefined) {
         // TODO : format to valid node.js/meteor exception?
        throw new Meteor.Error('INVALID_YOUTUBE_URL')
      }

       // TODO 404 : handle unexisting track
       // throw 'TRACKDOESNOTEXISTS';

      return youtubeCall('videos', {
        id,
        type: 'video',
        part: 'id, snippet',
        maxResults: 2
      })
      .then((youtubeData) => {
        return formatYoutubeData(youtubeData.items[0])
      })
    },

    'youtube.search' (keywords, limit) {
      return youtubeCall('search', {
        q: keywords,
        type: 'video',
        part: 'id, snippet',
        maxResults: limit
      })
      .then((youtubeSearch) => {
        return youtubeSearch.items.map(formatYoutubeData)
      })
    }
  })
}
