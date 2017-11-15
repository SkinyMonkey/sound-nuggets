import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Field, reduxForm } from 'redux-form'

import FacebookLogin from 'react-facebook-login';

import sessionActions from '../../actions/session.js'
import flashMessagesActions from '../../actions/flash_messages.js'

import FlashMessage from '../../components/FlashMessage.jsx'
import { renderField } from '../../components/Inputs.jsx'
import { required, email } from '../../components/InputsValidation.jsx'

import { Button, Panel, Col, Row } from 'react-bootstrap'

// FIXME : clearFlashMessage
class Login extends Component {
  componentWillUnmount () {
    this.props.clearFlashMessage()
  }

  facebookLogin (result) {
    this.props.facebookLogin(result.id, result.accessToken)
        .then((userId) => {
		      this.props.history.push('/profile/' + userId + '/stream')
        })
        .catch(this.props.flashDanger)
  }

  emailLogin (event) {
    event.preventDefault()

    const { email, password, emailLogin } = this.props
        
		if (!email || !password) {
			this.props.flashDanger('Email and password cannot be empty')
			return
		}
		
    emailLogin(email, password)
         .then((userId) => {
		       this.props.history.push('/profile/' + userId + '/stream')
         })
         .catch(this.props.flashDanger)
 }

  panelHeader() {
    return <div>
      <h4>Login</h4>
      <FlashMessage />
    </div>
  }

  render () {
    return <Col xs={6} md={6} id="session">
      <Panel header={this.panelHeader()} id="session-panel">
        <form onSubmit={this.emailLogin.bind(this)}>
          <Field type='email'
            label='Email'
            name='email'
            className='session-input'
            component={renderField}
            validate={[required, email]}
                 />

          <Field type='password'
            label='Password'
            name='password'
            className='session-input'
            component={renderField}
            validate={[required]}
                 />
         <Button className='session-button' type='submit' disabled={this.props.submitting}>
         	Login 
         </Button>
        </form>
        <div id="session-bottom">
          <Row>
            <FacebookLogin
              appId={Meteor.settings.public.FACEBOOK_APP_ID}
              autoLoad={false}
              callback={this.facebookLogin.bind(this)}
              icon="fa-facebook"
            />
          </Row>
          {/*
          <Row>
            <Link to='/register'>Not registered yet? Create an account!</Link>
          </Row>
          */}
        </div>
      </Panel>
    </Col>
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.form.login && state.form.login.values && state.form.login.values.email,
    password: state.form.login && state.form.login.values && state.form.login.values.password
  }
}

const actionProps = {
  ...sessionActions,
  ...flashMessagesActions,
}

export default connect(mapStateToProps, actionProps)(reduxForm({ form: 'login' })(Login))
