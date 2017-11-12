import player, { INITIAL_STATE } from '../player.js'
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
} from '../../types/player.js'
import { LOAD_MORE } from '../../types/tracklist.js'

describe('Player reducer', () => {
  it('should return the initial state', () => {
    const newState = player(undefined, {})
    const expectedState = INITIAL_STATE;

    expect(newState).toEqual(expectedState)
  });

  // FIXME : not sure about that behaviour
  //         could be the origin of a bug in load_more
  //         check it
  it('should test LOAD_MORE', () => {
    const action = { type: LOAD_MORE }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      end: false
    };

    expect(newState).toEqual(expectedState)
  })

  it('should test PLAYER_LOAD_PLAYLIST with pristine player', () => {
    const url = 'https://test.com'
    const track = {url}
    const playlist = [{}, track]
    const tracklistURL = '/profile/:profile_id/tracks'
    const action = {
      type: PLAYER_LOAD_PLAYLIST,
      payload: {
        url,
        playlist,
        tracklistURL,
      }
    }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      url,
      playlist,
      playing: true,
      index: 1,
      track,
      tracklistURL,
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PLAYER_LOAD_PLAYLIST with used player, empty action.payload', () => {
    const url = 'https://test.com'
    const track = {url}
    const playlist = [{}, track]
    const tracklistURL = '/profile/:profile_id/tracks'
    const action = {
      type: PLAYER_LOAD_PLAYLIST,
      payload: {}
    }
    const state = {
      ...INITIAL_STATE,
      url,
      playlist,
      tracklistURL
    }
    const newState = player(state, action);
    const expectedState = {
      ...state,
      url,
      playlist,
      playing: true,
      index: 1,
      track,
      tracklistURL,
    }
 
    expect(newState).toEqual(expectedState)
  })
  
  it('should test PLAYER_LOAD_PLAYLIST, url not found', () => {
    const url = 'https://test.com'
    const track = {url}
    const playlist = [INITIAL_STATE.track, {}]
    const tracklistURL = '/profile/:profile_id/tracks'
    const action = {
      type: PLAYER_LOAD_PLAYLIST,
      payload: {}
    }
    const state = {
      ...INITIAL_STATE,
      playlist,
    }
    const newState = player(state, action);
    const expectedState = {
      ...state,
      playlist,
      index: 0,
      playing: true,
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PLAY_URL', () => {
    const url = 'https://url.com'
    const nextUrl = 'https://next-url.com'
    const track = {url}
    const nextTrack = {url: nextUrl}
    const playlist = [{}, nextTrack, track ]
    const action = {
      type: PLAY_URL,
      payload: nextUrl,
    }
    const state = {
      ...INITIAL_STATE,
      track,
      playlist,
      url,
      index: 2,
    }
    const newState = player(state, action);
    const expectedState = {
      ...state,
      url: nextUrl,
      index: 1,
      track: nextTrack,
      playing: true,
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test NEXT_TRACK', () => {
    const url = 'https://url.com'
    const nextUrl = 'https://next-url.com'
    const track = {url}
    const nextTrack = {url: nextUrl}
    const playlist = [{}, track, nextTrack]
    const action = {
      type: NEXT_TRACK,
    }
    const state = {
      ...INITIAL_STATE,
      playlist,
      url,
      index: 1,
      track,
    }
    const newState = player(state, action);
    const expectedState = {
      ...state,
      url: nextUrl,
      playlist,
      index: 2,
      track: nextTrack,
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PREVIOUS_TRACK', () => {
    const url = 'https://url.com'
    const previousUrl = 'https://previous-url.com'
    const track = {url}
    const previousTrack = {url: previousUrl}
    const playlist = [{}, previousTrack, track ]
    const action = {
      type: PREVIOUS_TRACK,
    }
    const state = {
      ...INITIAL_STATE,
      playlist,
      url,
      index: 2,
      track,
    }
    const newState = player(state, action);
    const expectedState = {
      ...state,
      url: previousUrl,
      playlist,
      index: 1,
      track: previousTrack,
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PLAYLIST_END', () => {
    const action = {
      type: PLAYLIST_END
    }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      end: true
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PLAY_TOGGLE', () => {
    const action = {
      type: PLAY_TOGGLE
    }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      playing: true
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test LOOP_TOOGLE', () => {
    const action = {
      type: LOOP_TOOGLE
    }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      loop: true
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PLAY', () => {
    const action = {
      type: PLAY
    }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      playing: true
    }
 
    expect(newState).toEqual(expectedState)
  })

  it('should test PAUSE', () => {
     const action = {
      type: PAUSE
    }
    const newState = player(INITIAL_STATE, action);
    const expectedState = {
      ...INITIAL_STATE,
      playing: false
    }
 
    expect(newState).toEqual(expectedState)
  })
});
