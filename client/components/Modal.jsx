import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'

import modalActions from '../actions/modal.js'

export const GenericModal = (props) => {
  const { show, title, page, closeModal, partial } = props

  return (<Modal show={show} onHide={closeModal} id='generic-modal'>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>

    </Modal.Header>
    <Modal.Body>
      { partial ? React.createElement(partial, props) : ''}
    </Modal.Body>
  </Modal>)
}

const mapStateToProps = (state) => {
  return {
    ...state.modal,
    show: state.modal.show,
    title: state.modal.title,
    page: state.modal.page,
    partial: state.modal.partial,
  }
}

export default connect(mapStateToProps, modalActions)(GenericModal)
