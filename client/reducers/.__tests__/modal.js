import modal, { INITIAL_STATE } from '../modal.js'
import { OPEN_MODAL, CLOSE_MODAL } from '../../types/modal.js'

describe('Modal reducer', () => {
  it('should return the initial state', () => {
    const newState = modal(undefined, {})
    const expectedState = INITIAL_STATE;

    expect(newState).toEqual(expectedState)
  });

  it('should OPEN_MODAL and save custom data into the state', () => {
    const test = 'test';
    const action = {
      type: OPEN_MODAL,
      payload: { test }
    }
    const newState = modal(INITIAL_STATE, action)
    const expectedState = {
      ...INITIAL_STATE,
      show: true,
      test
    };

    expect(newState).toEqual(expectedState)
  });

  it('should CLOSE_MODAL', () => {
    const action = {
      type: CLOSE_MODAL,
    }
    const newState = modal(INITIAL_STATE, action)
    const expectedState = {
      ...INITIAL_STATE,
      show: false,
    };

    expect(newState).toEqual(expectedState)
  })
});
