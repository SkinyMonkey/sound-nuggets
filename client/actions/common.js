export function genericDispatch (type) {
  return () => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        dispatch({ type })
        resolve()
      })
    }
  }
}

export function dispatchSet (type) {
  return (payload) => {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        dispatch({ type, payload })
        resolve()
      })
    }
  }
}
