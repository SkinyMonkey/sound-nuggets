import { genericDispatch, dispatchSet } from './common'

import { PLAYER_LOAD_PLAYLIST,
         NEXT_TRACK,
         PREVIOUS_TRACK,
         PLAYLIST_END,
         PLAY_TOGGLE,
         PLAY_URL,
         PLAY,
         PAUSE,
         LOOP_TOOGLE
       } from '../types/player'

export const loadPlaylist = dispatchSet(PLAYER_LOAD_PLAYLIST)
export const playUrl = dispatchSet(PLAY_URL)

export const nextTrack = genericDispatch(NEXT_TRACK)
export const previousTrack = genericDispatch(PREVIOUS_TRACK)
export const playlistEnd = genericDispatch(PLAYLIST_END)
export const playToggle = genericDispatch(PLAY_TOGGLE)
export const play = genericDispatch(PLAY)
export const pause = genericDispatch(PAUSE)
export const loopToogle = genericDispatch(LOOP_TOOGLE)
