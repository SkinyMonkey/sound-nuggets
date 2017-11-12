import { genericDispatch, dispatchSet } from './common'

import { OPEN_MODAL, CLOSE_MODAL } from '../types/modal'

export const openModal = dispatchSet(OPEN_MODAL)
export const closeModal = genericDispatch(CLOSE_MODAL)
