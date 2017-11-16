import { combineReducers } from 'redux'
import session from './session'
import tracklist from './tracklist'
import player from './player'
import modal from './modal'
import flashMessages from './flash_messages'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  session,
  tracklist,
  player,
  modal,
  flashMessages,
  form: formReducer
})
