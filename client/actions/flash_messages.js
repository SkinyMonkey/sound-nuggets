import { genericDispatch, dispatchSet } from './common'

import { FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../types/flash_messages'

function dispatchAlertSet (type, alertType) {
  return (payload) => {
    return dispatchSet(type)({message: payload, type: alertType})
  }
}

export const flashDanger = dispatchAlertSet(FLASH_MESSAGE, 'danger')
export const flashInfo = dispatchAlertSet(FLASH_MESSAGE, 'info')
export const flashSuccess = dispatchAlertSet(FLASH_MESSAGE, 'success')
export const flashWarning = dispatchAlertSet(FLASH_MESSAGE, 'warning')

export const clearFlashMessage = genericDispatch(CLEAR_FLASH_MESSAGE)
