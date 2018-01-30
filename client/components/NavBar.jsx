import React from 'react'
import { connect } from 'react-redux'

import { Navbar, Nav, NavItem, MenuItem, DropdownButton, ButtonGroup, Button } from 'react-bootstrap'

import sessionActions from '../actions/session.js'
import modalActions from '../actions/modal.js'
import AddIssue from '../partials/AddIssue.jsx'
import Search from './Search.jsx'

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

const NavBar = ({ match, history, session, logout }) => {
  const profileId = match.params.profileId
  const isAuth = session.isAuth
  const currentUser = session.currentUser
  const userId = currentUser ? currentUser._id : ''
  const image = currentUser.image || '/img/defaultAvatar.png'
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

  // TODO : clean this
  // To keep the order of display
  let NAV_BAR_ENTRY = isAuth ? ['/hottracks'] : ['/welcome']
  let NAV_BAR_ENTRIES = isAuth ? {
    '/hottracks': 'Hot tracks'
  }
  : {
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
          Sound nuggets
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
               <strong>{currentUser.username}</strong>
             </Button>
             <DropdownButton title='' id='navbar-profile'>
               <MenuItem eventKey='playlists' onClick={() => { history.push('/profile/' + userId + '/playlists') }}>Playlists</MenuItem>
             </DropdownButton>
           </ButtonGroup>

           <DropdownButton title={<span className='oi oi-cog' />} id='settings-dropdown'>
           {/*<MenuItem eventKey='invite-friends'>Invite Friends</MenuItem>
             <MenuItem eventKey='settings'>Settings</MenuItem>*/}
             <MenuItem eventKey='logout' onClick={logout}>Logout</MenuItem>
           </DropdownButton>

         </div>
       }
        </Navbar.Form>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps, sessionActions)(NavBar)
