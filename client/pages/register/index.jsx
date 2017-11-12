import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Accounts } from 'meteor/accounts-base'

import { Field, reduxForm } from 'redux-form'

import actionProps from '../../actions/flash_messages.js'
import FlashMessage from '../../components/FlashMessage.jsx'
import { renderField } from '../../components/Inputs.jsx'
import { required, email, password, username, cleanPassword } from '../../components/InputsValidation.jsx'

import { Button, Panel, Col, Row } from 'react-bootstrap'

class Register extends Component {
  componentWillUnmount () {
    this.props.clearFlashMessage()
  }

  facebookRegister (event) {
    event.preventDefault()

    Meteor.loginWithFacebook((error) => {
      if (error) {
        this.props.flashDanger(error.reason)
      }
    })
  }

  emailRegister (event) {
    event.preventDefault()

    const { email, password, username } = this.props

    Accounts.createUser({ email, password, username }, (error) => {
      if (error) {
        this.props.flashDanger(error.reason)
      }
    })
  }
  panelHeader() {
    return <div>
      <h4>Register</h4>
      <FlashMessage />
    </div>
  }

  render () {
    return <Col xs={6} md={6} id="session">
      <Panel header={this.panelHeader()} id="session-panel">
      <form onSubmit={this.emailRegister.bind(this)}>
        <Field type='email'
          label='Email'
          name='email'
          component={renderField}
          validate={[required, email]}
             />

        <Field type='username'
          label='Username'
          name='username'
          component={renderField}
          validate={[required, username]}
             />

        <Field type='password'
          label='Password'
          name='password'
          component={renderField}
          parse={cleanPassword}
          validate={[required, password]}
             />

        <Field type='password'
          label='Confirm password'
          name='passwordConfirm'
          component={renderField}
          parse={cleanPassword}
          validate={[required, password]}
             />

        <Button className='session-button' type='submit' disabled={this.props.submitting}>
          Submit
        </Button>
      </form>
      <div id="session-bottom">
        <Row>
          <Button className='btn-facebook' onClick={this.facebookRegister.bind(this)}>Register with facebook</Button>
        </Row>
        <Row>
          <Link to='/login'>Already registered? Login!</Link>
        </Row>
      </div>
    </Panel>
    </Col>
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.form.register && state.form.register.values && state.form.register.values.email,
    password: state.form.register && state.form.register.values && state.form.register.values.password,
    username: state.form.register && state.form.register.values && state.form.register.values.username
  }
}

export default connect(mapStateToProps, actionProps)(reduxForm({ form: 'register' })(Register))
