import tracklist, { INITIAL_STATE, PAGE_SIZE } from '../tracklist.js'
import { PRISTINE, LOAD, LOAD_MORE } from '../../types/tracklist.js'

describe('Tracklist reducer', () => {
  it('should return the initial state', () => {
    const newState = tracklist(undefined, {})
    const expectedState = INITIAL_STATE;

    expect(newState).toEqual(expectedState)
  });

  it('should set the pristine value in state', () => {
    const action = {
      type: PRISTINE,
      payload: true
    }
    const newState = tracklist(INITIAL_STATE, action)
    const expectedState = {
      ...INITIAL_STATE,
      pristine: true
    };

    expect(newState).toEqual(expectedState)
  });

  it('should initialise/reinitialise the limit field to PAGE_SIZE', () => {
    const action = {
      type: LOAD,
    }
    const newState = tracklist(INITIAL_STATE, action)
    const expectedState = {
      ...INITIAL_STATE,
      limit: PAGE_SIZE
    };

    expect(newState).toEqual(expectedState)
  });

  it('should increment the limit field to 2 * PAGE_SIZE', () => {
    const action = {
      type: LOAD_MORE,
    }
    const newState = tracklist(INITIAL_STATE, action)
    const expectedState = {
      ...INITIAL_STATE,
      limit: PAGE_SIZE * 2
    };

    expect(newState).toEqual(expectedState)
  });
});
