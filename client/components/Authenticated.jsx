import React from 'react'
import { Redirect } from 'react-router-dom'

const Authenticated = (Component, session = null) => {
  return (props) => {
    let mergedProps = props
    if (session !== null) {
      mergedProps = {
        ...props,
        session
      }
    }

    if (!session || (session && !session.isAuth)) {
      return <Redirect to='/welcome' />
    }
    return <main>
      {React.createElement(Component, mergedProps)}
    </main>
  }
}

export default Authenticated
