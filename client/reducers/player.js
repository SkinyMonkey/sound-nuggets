import {
  PLAYER_LOAD_PLAYLIST,
  NEXT_TRACK,
  PREVIOUS_TRACK,
  PLAYLIST_END,
  PLAY_TOGGLE,
  PLAY,
  PAUSE,
  PLAY_URL,
  LOOP_TOOGLE
} from '../types/player'

import { LOAD_MORE } from '../types/tracklist'

export const INITIAL_STATE = {
  playlist: [], // current playing playlist
  end: false, // did we reach the end of the playlist or not
  playing: false, // is the player is playing or not
  loop: false, // should the player repeat the current track
  index: 0, // what is the index of track in playlist based on url
  track: { _id: '' }, // current track playing
  tracklistURL: '' // URL of the tracklist playing
}

const player = (state = INITIAL_STATE, action) => {
  let currentIndex = 0
  let track = null

  switch (action.type) {
    case LOAD_MORE:
      return {
        ...state,
        end: false
      }

    case PLAYER_LOAD_PLAYLIST:
      // Url playing, in state always has priority when playlist loading
      const url = action.payload.url ||
                  state.url

      // New playlist always has priority over the older one
      const playlist = action.payload.playlist ||
                       state.playlist

      const tracklistURL = action.payload.tracklistURL ||
                           state.tracklistURL

      const playing = action.payload.playing ||
                      state.playing

      // We get the index of the playing url
      currentIndex = playlist.findIndex((track) => {
        return track.url === url
      })
      
      // Default it if not found
      if (currentIndex === -1) {
        currentIndex = state.index
      }

      return {
        ...state,
        url,
        playlist,
        playing,
        tracklistURL,
        index: currentIndex,
        track: playlist[currentIndex],
      }

    case PLAY_URL:
      // We find the url in the current playlist
      currentIndex = state.playlist.findIndex((track) => {
        return track.url === action.payload
      })

      // Default it if not found
      if (currentIndex === -1) {
        currentIndex = state.index
      }

      return {
        ...state,
        url: action.payload,
        playing: true,
        index: currentIndex,
        track: state.playlist[currentIndex]
      }

    case NEXT_TRACK:
      // We find the index of the playing url in current playlist
      currentIndex = state.playlist.findIndex((track) => {
        return track.url === state.url
      })

      // Default it if not found
      if (currentIndex === -1) {
        currentIndex = state.index
      }

      // We get the track at current index + 1
      track = state.playlist[ currentIndex + 1 ]

      return {
        ...state,
        url: track.url,
        index: currentIndex + 1,
        track
      }

    case PREVIOUS_TRACK:
      // We find the index of the playing url in current playlist
      currentIndex = state.playlist.findIndex((track) => {
        return track.url === state.url
      })

      // Default it if not found
      if (currentIndex === -1) {
        currentIndex = state.index
      }

      // We get the track at current index - 1
      track = state.playlist[ currentIndex - 1 ]

      return {
        ...state,
        url: track.url,
        index: currentIndex - 1,
        track
      }

    case PLAYLIST_END:
      return {
        ...state,
        end: true
      }

    case PLAY_TOGGLE:
      return {
        ...state,
        playing: !state.playing
      }

    case LOOP_TOOGLE:
      return {
        ...state,
        loop: !state.loop
      }

    case PLAY:
      return {
        ...state,
        playing: true
      }

    case PAUSE:
      return {
        ...state,
        playing: false
      }
  }

  return state
}

export default player
