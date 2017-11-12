import {
  PRISTINE,
  LOAD,
  LOAD_MORE
} from '../types/tracklist'

export const PAGE_SIZE = 10

export const INITIAL_STATE = {
  pristine: true,
  limit: PAGE_SIZE
}

const tracklist = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PRISTINE:
      return {
        ...state,
        pristine: action.payload
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
  }

  return state
}

export default tracklist
