import React, { Component } from 'react'
import { Panel, Col, Media } from 'react-bootstrap'

import HotTracks from './HotTracks.jsx'
import Donate from '../../components/Donate.jsx'
import Patreon from '../../components/Patreon.jsx'

// import Container from '../../components/Container.jsx'

// TODO : wrap cleanly into a generic Container element
//        -> fix CSS
export class Welcome extends Component {
  render () {
    const panelTitle = (
      <h3>Welcome to sound-nuggets! (the openwhyd frontend)</h3>
    )

    return <div className='page-container container'>
      <Col md={7}>
      <Panel id='welcome' header={panelTitle}>
          <HotTracks {...this.props} />
      </Panel>
      </Col>
      <Donate/>
      <Patreon/>
   </div>
  }
}
export default Welcome
