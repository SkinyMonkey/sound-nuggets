import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'

import HotTracks from './HotTracks.jsx'

// import Container from '../../components/Container.jsx'

// TODO : wrap cleanly into a generic Container element
//        -> fix CSS
export class Welcome extends Component {
  render () {
    return <div className='page-container container'>
      <Panel id='welcome'>
        <h3>Welcome to Diggaz, an openwhyd client and clone</h3>
        <HotTracks {...this.props} />
      </Panel>
    </div>
  }
}
export default Welcome
