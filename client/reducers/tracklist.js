import {
  PRISTINE,
  LOAD,
  LOAD_MORE,
  LOAD_TRACKLIST
} from '../types/tracklist'

export const PAGE_SIZE = 10

export const INITIAL_STATE = {
  pristine: true,
  limit: PAGE_SIZE,
  tracks: []
}

const tracklist = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PRISTINE:
      return {
        ...state,
        pristine: action.payload
      }

    case LOAD_TRACKLIST:
      return {
        ...state,
        tracks: action.payload.tracks
      }

    case LOAD:
      return {
        ...state,
        limit: PAGE_SIZE
      }

    case LOAD_MORE:
      return {
        ...state,
        limit: state.limit + PAGE_SIZE
      }

    case ADD_TRACK:
      return {
        ...state,
        tracks: state.tracks.concat([action.payload])
      }

    case REMOVE_TRACK:
      return {
        ...state,
        tracks: state.tracks.filter((track) => {
          return track._id != action.payload
        })
      }
  }

  return state
}

export default tracklist
