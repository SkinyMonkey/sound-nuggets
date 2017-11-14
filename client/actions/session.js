import { LOGIN, LOGOUT } from '../types/session'
import { genericDispatch, dispatchSet } from './common'

import cookie from './cookies'

const WHYD_COOKIE = 'whydSid'

// Resume the session from localstorage
export const resume = () => {
  return (dispatch) => {
    const session = localStorage.getItem('session')
    if (session &&
				cookie.hasItem(WHYD_COOKIE) &&
			 !cookie.itemExpired(WHYD_COOKIE)) {

      dispatch({ type: LOGIN, payload: JSON.parse(session) })
    }
  }
}

export const login = (email, password) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      Meteor.call('openwhyd.login.email', email, password, (error, session) => {
        if (session.error) return reject(session.error)

				cookie.removeItem(WHYD_COOKIE)
        session.cookie.split(';').forEach((cookie) => {
          document.cookie = cookie
        })

				localStorage.setItem('session', JSON.stringify(session))
        dispatch({ type: LOGIN, payload: session })

        return resolve(session.currentUser._id)
      })
    })
  }
}

export const logout = () => {
	return (dispatch) => {
		return new Promise((resolve, reject) => {
      Meteor.call('openwhyd.logout', document.cookie, (error) => {
				cookie.removeItem(WHYD_COOKIE)
				localStorage.removeItem('session')

        dispatch({ type: LOGOUT })
      })
		})
	}
}
