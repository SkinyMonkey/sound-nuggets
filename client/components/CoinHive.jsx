import React, { Component } from 'react'
import { connect } from 'react-redux'
import CoinHive from 'react-coin-hive'

import modalActions from '../actions/modal.js'
import CoinHiveDisclaimer from '../partials/CoinHiveDisclaimer.jsx'

const SECOND = 1000
const MINUTE = 60 * SECOND

// DISCLAIMER:
// This miner is used to pay the server.
// No personal profit here.

class SoundNuggetsCoinHive extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      throttle: Meteor.settings.public.throttle,
      on: false,
    }

    this.timer = null
  }

  displayDisclaimer(event) {
    event.preventDefault()
    this.props.openModal({
      title: 'Coinhive disclaimer',
      partial: CoinHiveDisclaimer
    })
  }

  onStart () {
    this.setState({on: true})
/*
    this.timer = setInterval(() => {
      console.log(this.state.throttle);
      if (this.state.throttle === 0.8) {
        return this.setState({throttle: 0.1});
      }
      this.setState({throttle: this.state.throttle + 0.1});
    }, 10 * MINUTE);
*/
  }

  onStop () {
    this.setState({on: false})
//    clearInterval(this.timer)
//    this.setState({throttle: 0.1})
  }

  render () {

    const lightClass = 'coinhive-light-' + (this.state.on ? 'on' : 'off')
    const onText = 'CoinHive ' + (this.state.on ? 'On' : 'Off')
 
    return <div onClick={this.displayDisclaimer.bind(this)}>
      <p>{onText}</p>
      <p className={'coinhive-light ' + lightClass}></p>

      <CoinHive siteKey='ZdA9clPbISwnvt6HViJLH53NXY9HdHY2'
      threads={1}
      userName={this.props.username || 'Anonymous'}
      throttle={this.state.throttle}
      onStart={this.onStart.bind(this)}
      onStop={this.onStop.bind(this)}
      timeout={10000}
      />
    </div>
  }
}

const actionProps = {
  ...modalActions,
}

export default connect(null, actionProps)(SoundNuggetsCoinHive)
