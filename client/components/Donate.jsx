import React from 'react'
import { Col, Panel, Media } from 'react-bootstrap'

const Donate = () => (<Col md={4}>
  <Panel id='donate'>
    <h4>💓 Openwhyd needs you!</h4>
    <Media.Left>
      <img src='/img/github-octocat.png' height={64} width={64}/>
    </Media.Left>
    <Media.Body>
      <p>Help us keep Openwhyd free, independant and without ads.</p>
      <p><b>Donate today!</b></p>
      {[1, 2, 5, 10, 20].map((value) => {
        const className = value > 9 ? 'donate-big' : 'donate-small'
        return <Col md={1} className={'donate ' + className} key={value}>
        <a href='https://opencollective.com/openwhyd/donate'>{value}$</a>
        </Col>
      })}
    </Media.Body>
  </Panel>
</Col>)

export default Donate
