import {
  PRISTINE
, LOAD_TRACKLIST
, LOAD
, LOAD_MORE
, ADD_TRACK
, REMOVE_TRACK
} from '../types/tracklist'

import { genericDispatch, dispatchSet } from './common'

export const setPristine = dispatchSet(PRISTINE)
export const loadTracklist = dispatchSet(LOAD_TRACKLIST)

export const load = genericDispatch(LOAD)
export const loadMore = genericDispatch(LOAD_MORE)

// TODO : reimplement by hand
//        chain to player to add or remove a track
//        if we are on the same tracklist_url?
export const addTrack = dispatchSet(ADD_TRACK)
export const removeTrack = dispatchSet(REMOVE_TRACK)
