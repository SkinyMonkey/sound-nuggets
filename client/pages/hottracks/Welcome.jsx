import React, { Component } from 'react'
import { Panel, Col, Media } from 'react-bootstrap'

import HotTracks from './HotTracks.jsx'

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
      <Col md={4}>
        <Panel id='donate'>
          <h4>💓 Openwhyd needs you!</h4>
          <Media.Left>
            <img src='/img/github-octocat.png'height={64} width={64}/>
          </Media.Left>
          <Media.Body>
            <p>Help us keep Openwhyd free, independant and without ads.</p>
            <p><b>Donate today!</b></p>
            {[1, 2, 5, 10, 20].map((value) => {
              className = value > 9 ? 'donate-big' : 'donate-small'
              return <Col md={1} className={'donate ' + className}>
              <a href='https://opencollective.com/openwhyd/donate'>{value}$</a>
              </Col>
            })}
          </Media.Body>
        </Panel>
      </Col>
    </div>
  }
}
export default Welcome
