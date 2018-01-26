import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Col, Panel, FormGroup, ButtonGroup, Button } from 'react-bootstrap'

import modalActions from '../../../actions/modal.js'
import AddPlaylist from '../../../partials/AddPlaylist.jsx'

const addPlaylistWrapper = (WrappedComponent, title) => {
  class AddPlaylistWrapper extends Component {
    render () {
      const panelTitle = (
        <FormGroup>
          <Col md={11} xs={11} id='add-playlist-wrapper-title'>
            <h5>{title}</h5>
          </Col>
          <Col>
            { !this.props.session.isAuth ||
                 this.props.session.currentUser._id !==
                 this.props.profile._id
                ? <Button style={{visibility: 'hidden'}} />
                : <ButtonGroup>
                  <Button bsStyle='success' onClick={() => {
                    this.props.openModal({
                      partial: AddPlaylist,
                      title: 'Add a playlist'
                    })
                  }}>
                    <span className='oi oi-plus' />
                  </Button>
                </ButtonGroup>
              }
          </Col>
        </FormGroup>)

      return <Panel id='new-playlist' header={panelTitle}>
        {React.createElement(WrappedComponent, {...this.props})}
      </Panel>
    }
  }

  return connect(null, modalActions)(AddPlaylistWrapper)
}

export default addPlaylistWrapper
