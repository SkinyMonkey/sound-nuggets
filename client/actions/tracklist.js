import { PRISTINE, LOAD, LOAD_MORE } from '../types/tracklist'
import { genericDispatch, dispatchSet } from './common'

export const setPristine = dispatchSet(PRISTINE)

export const load = genericDispatch(LOAD)
export const loadMore = genericDispatch(LOAD_MORE)
