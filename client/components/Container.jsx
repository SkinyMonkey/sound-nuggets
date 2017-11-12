import React from 'react'
import { Col } from 'react-bootstrap'

const Container = (component) => {
  return (props) => {
    return <div className='page-container container'>
      <Col md={8}>
        {React.createElement(component, props)}
      </Col>
    </div>
  }
}

export default Container
