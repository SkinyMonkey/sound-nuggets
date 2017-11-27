import React from 'react'
import { Col, Panel, Media, Image } from 'react-bootstrap'

const Patreon = () => (<Col md={4}>
  <Panel id='patreon'>
    <h4>I need you too ^^</h4>
    <Media.Left>
      <Col xs={2} md={2}>
        <Image src='/img/foxface.jpeg' circle height={64} width={64} />
      </Col>
    </Media.Left>
    <Media.Body>
      <p>You can also support me on 
        <a href='https://www.patreon.com/user?u=8598416'>
        {" Patreon "}
        </a>
        :)
      </p>
    </Media.Body>
  </Panel>
</Col>)

export default Patreon
