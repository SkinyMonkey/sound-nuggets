import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

import { Navbar, Nav, NavItem, MenuItem, DropdownButton, ButtonGroup, Button } from 'react-bootstrap'

import Search from './Search.jsx'

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

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
          Diggaz
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
        <Navbar.Form pullLeft>
          <Search thirdPartyApis={isAuth} history={history} session={session} />
        </Navbar.Form>
        <Navbar.Form pullRight>
          { !isAuth
          ? <Button onClick={() => history.push('/login')}>Login</Button>
          : <div>
            <ButtonGroup id='profile-dropdown'>
              <Button onClick={() => history.push('/profile/' + userId + '/tracks')} >
                <div className='img-circle' style={buttonAvatarStyle} alt='User avatar' />
                <strong>{profile.username}</strong>
              </Button>
              <DropdownButton title='' id='navbar-profile'>
                <MenuItem eventKey='playlists' onClick={() => { history.push('/profile/' + userId + '/playlists') }}>Playlists</MenuItem>
              </DropdownButton>
            </ButtonGroup>

            <DropdownButton title={<span className='oi oi-cog' />} id='settings-dropdown'>
              <MenuItem eventKey='invite-friends'>Invite Friends</MenuItem>
              <MenuItem eventKey='settings'>Settings</MenuItem>
              <MenuItem eventKey='logout' onClick={() => Meteor.logout()}>Logout</MenuItem>
            </DropdownButton>

          </div>
        }
        </Navbar.Form>
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
