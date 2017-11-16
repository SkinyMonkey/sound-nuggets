import { LOGIN, LOGOUT } from '../types/session.js'

// TODO : check cookie and restore user from localStorage?
//        if he is?
//        from App.jsx?

export const INITIAL_STATE = {
  isAuth: false,
  currentUser: {},
  username: '',
  defaultPlaylist: {},
  cookie: document.cookie,
}

const session = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...action.payload,
        isAuth: true
      }

    case LOGOUT:
      return INITIAL_STATE
  }

  return state
}

export default session
