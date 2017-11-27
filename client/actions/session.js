import { LOGIN, LOGOUT } from '../types/session'
import { genericDispatch, dispatchSet } from './common'

import cookie from './cookies'

const WHYD_COOKIE = 'whydSid'
const FSBR = 'fbsr'

const COOKIE_ITEMS = [ WHYD_COOKIE ]

// fbsr_118010211606360
// `fbsr_${facebook_uid}`
// Add facebook_uid to session?

// Resume the session from localstorage
export const resume = () => {
  return (dispatch) => {
    const session = localStorage.getItem('session')
//    const fbsrKey = cookie.getRealKey(FSBR)

    if (session &&
       /*((cookie.hasApproximateItem(FSBR) &&
        !cookie.itemExpired(fbsrKey))
        ||*/
				(cookie.hasItem(WHYD_COOKIE) &&
			  !cookie.itemExpired(WHYD_COOKIE))) {

      dispatch({ type: LOGIN, payload: JSON.parse(session) })
    }
  }
}

const setSession = (resolve, reject, dispatch) => (error, session) => {
  if (session.error) return reject(session.error)

  cookie.removeAllItems()
  session.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie
  })

  localStorage.setItem('session', JSON.stringify(session))
  dispatch({ type: LOGIN, payload: session })

  return resolve(session.currentUser._id)
}

export const emailLogin = (email, password) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      Meteor.call('openwhyd.login.email', email, password, setSession(resolve, reject, dispatch))
    })
  }
}

export const facebookLogin = (facebookId, accessToken) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      Meteor.call('openwhyd.login.facebook', facebookId, accessToken, setSession(resolve, reject, dispatch))
    })
  }
}

export const logout = () => {
	return (dispatch) => {
		return new Promise((resolve, reject) => {
      Meteor.call('openwhyd.logout', document.cookie, (error) => {
        cookie.removeAllItems()

				localStorage.removeItem('session')

        dispatch({ type: LOGOUT })
      })
		})
	}
}
