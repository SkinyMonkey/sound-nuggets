import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Field, reduxForm } from 'redux-form'

import actionProps from '../../actions/flash_messages.js'
import FlashMessage from '../../components/FlashMessage.jsx'
import { renderField } from '../../components/Inputs.jsx'
import { required, email } from '../../components/InputsValidation.jsx'

import { Button, Panel, Col, Row } from 'react-bootstrap'

class Login extends Component {
  componentWillUnmount () {
    this.props.clearFlashMessage()
  }

  facebookLogin (event) {
    event.preventDefault()

    Meteor.loginWithFacebook((error) => {
      if (error) {
        this.props.flashDanger(error.reason)
// TODO : async error instead
      }
    })
  }

  emailLogin (event) {
    event.preventDefault()

    const { email, password } = this.props

    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        this.props.flashDanger(error.reason)
// TODO : async error instead
      }
    })
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
          Submit
         </Button>
        </form>
        <div id="session-bottom">
          <Row>
            <Button className='btn-facebook' onClick={this.facebookLogin.bind(this)}>
              Login with facebook
            </Button>
          </Row>
          <Row>
            <Link to='/register'>Not registered yet? Create an account!</Link>
          </Row>
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

export default connect(mapStateToProps, actionProps)(reduxForm({ form: 'login' })(Login))
