import React from 'react'
import { connect } from 'react-redux'

import { withTracker } from 'meteor/react-meteor-data'

import { Navbar, Nav, NavItem, MenuItem, DropdownButton, ButtonGroup, Button } from 'react-bootstrap'

import modalActions from '../actions/modal.js'
import AddIssue from '../partials/AddIssue.jsx'

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const SendBugNavItem = connect(null, modalActions)((props) => {
  return <NavItem key={'issue'}
    onClick={() => {
      props.openModal({
        title: 'Send an issue',
        partial: AddIssue,
      })
    }}>
    Found a bug?
  </NavItem>
})

const Bar = ({profileId, session, history}) => {
  const isAuth = session.isAuth
  const currentUser = session.currentUser
  const userId = currentUser ? currentUser._id : ''
  const profile = currentUser ? currentUser.profile : {}
  const image = profile.image || '/img/defaultAvatar.png'
  const buttonAvatarStyle = !currentUser ? {} : {
    'backgroundImage': 'url(' + image + ')',
    'backgroundRepeat': 'no-repeat',
    'backgroundSize': 'cover',
    'marginRight': '5px',
    'paddingLeft': '0px',
    'width': '22px',
    'height': '22px',
    'float': 'left'
  }

  // To keep the order of display
  let NAV_BAR_ENTRY = ['/welcome']
  let NAV_BAR_ENTRIES = {
    '/welcome': 'Hot tracks'
  }

  if (isAuth) {
    NAV_BAR_ENTRY.unshift('/stream')
    NAV_BAR_ENTRIES['/stream'] = 'Stream'
  }

  return (
    <Navbar fixedTop collapseOnSelect id='navbar'>
      <Navbar.Header>
        <Navbar.Brand>
          Demo
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>

      <Navbar.Collapse>
        <Nav>
        { NAV_BAR_ENTRY.map((entry) => {
            const selected = window.location.pathname.lastIndexOf(entry) > -1 ?
                           'onit' :
                           'navbar-entry'

            return <NavItem key={entry}
                            className={selected}
                            onClick={() => { history.push(entry) }}>
              {NAV_BAR_ENTRIES[entry]}
            </NavItem>
            })
        }
        </Nav>
        <Nav>
          <SendBugNavItem/>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const NavBar = withTracker(({match, session, history}) => {
  const profileId = match.params.profileId

  return {
    session,
    profileId,
    history
  }
})(Bar)

export default NavBar
