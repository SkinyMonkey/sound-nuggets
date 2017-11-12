import { FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../types/flash_messages'

export const INITIAL_STATE = { message: '', type: '' }

const flashMessages = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FLASH_MESSAGE:
      return {
        ...state,
        ...action.payload
      }

    case CLEAR_FLASH_MESSAGE:
      return INITIAL_STATE
  }

  return state
}

export default flashMessages
