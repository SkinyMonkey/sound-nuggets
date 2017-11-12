import { OPEN_MODAL, CLOSE_MODAL } from '../types/modal.js'

export const INITIAL_STATE = { show: false, title: '', page: '' }

const modal = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        ...action.payload,
        show: true
      }

    case CLOSE_MODAL:
      return INITIAL_STATE
  }

  return state
}

export default modal
