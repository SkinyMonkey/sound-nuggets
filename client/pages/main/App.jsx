import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import sessionActions from '../../actions/session.js'
import withMethodData from '../../components/withMethodData.jsx'
import Authenticated from '../../components/Authenticated.jsx'
import CoinHive from '../../components/CoinHive.jsx'

import Modal from '../../components/Modal.jsx'
import NavBar from '../../components/NavBar.jsx'
import Player from '../../components/Player.jsx'

import Profile from '../profile/index.jsx'
import Welcome from '../hottracks/Welcome.jsx'
import Stream from '../../pages/profile/tracks/Stream.jsx'
import Login from '../session/Login.jsx'
import Register from '../register/index.jsx'

const Loading = () => {
  return <div id='loading'>
    <p>Loading</p>
  </div>
}

const MainWithNavBar = (Component, session) => {
  return (props) => {
    session = session === undefined ? props.session : session
    return <div>
      <NavBar match={props.match} session={session} history={props.history} />
      <main id='main'>
        {React.createElement(Component, {...props, session})}
      </main>
    </div>
  }
}

const RedirectIfAuthenticated = (Component, session) => {
  return (props) => {
    if (session.isAuth) {
      return <Redirect to={'/profile/' + session.currentUser._id + '/stream'} />
    }
    return <main id='main'>
      { React.createElement(Component, { ...props, session }) }
    </main>
  }
}

// App component - represents the whole app
class App extends Component {
  componentDidCatch(error, info) {
    console.error('Error:' + __filename + ' ' + error, info)
  }

	componentWillMount() {
		// resume session
		this.props.resume()
	}

  render () {
    // TODO : add a Settings page
    //        redirect to /stream if logged from /
    //        else to ?

    return (<div id='app'>
        <Router>
          <Switch>
            <Route path='/stream' component={Authenticated(MainWithNavBar(Stream), this.props)} />
            <Route path='/login' component={RedirectIfAuthenticated(Login, this.props)} />
            <Route path='/register' component={RedirectIfAuthenticated(Register, this.props)} />
            <Route path='/profile/:profileId' component={MainWithNavBar(Profile, this.props)} />
            <Route path='/hottracks' component={MainWithNavBar(Welcome, this.props)} />
            <Route path='/welcome' component={RedirectIfAuthenticated(MainWithNavBar(Welcome), this.props)} />
            <Route path='/' exact component={RedirectIfAuthenticated(MainWithNavBar(Welcome), this.props)} />
            <Route path='*' component={RedirectIfAuthenticated(MainWithNavBar(Welcome), this.props)} />
          </Switch>
        </Router>
        <Modal session={this.props} />
        <Player session={this.props} />
        <CoinHive />
        <footer id='footer' />
      </div>
    )
  }
}

App.propTypes = {
}

// could wrap the call to the API so we know when the request is pending and
// when it's resolved -> loading
// user is set in state on login
const mapStateToProps = (state) => {
  return {
    ...state.session
  }
}

export default connect(mapStateToProps, sessionActions)(App)
