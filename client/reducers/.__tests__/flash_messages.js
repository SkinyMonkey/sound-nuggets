import flash_messages, { INITIAL_STATE } from '../flash_messages.js'
import { FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../../types/flash_messages.js'

describe('FlashMessage reducer', () => {
  it('should return the initial state', () => {
    const newState = flash_messages(undefined, {})
    const expectedState = INITIAL_STATE

    expect(newState).toEqual(expectedState)
  })

  it('should set the message and type', () => {
    const payload = {
      type: FLASH_MESSAGE,
      payload: {
        type: 'danger',
        message : 'an error occured'
      }
    }
    const newState = flash_messages(INITIAL_STATE, payload)
    const expectedState = payload.payload

    expect(newState).toEqual(expectedState)
  })

  it('should clear the message and type', () => {
    const payload = {
      type: CLEAR_FLASH_MESSAGE,
    }
    const state = {
      type: 'danger',
      message : 'an error occured'
    }
    const newState = flash_messages(state, payload)
    const expectedState = INITIAL_STATE

    expect(newState).toEqual(expectedState)
  })
})
