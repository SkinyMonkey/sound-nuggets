import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, ButtonToolbar, FormControl, FormGroup, ControlLabel } from 'react-bootstrap'

import Confirm from './Confirm.jsx'

class EditPlaylist extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      playlistName: this.props.playlist.name
    }
  }

  onNameChange (event) {
    this.setState({ playlistName: event.target.value })
  }

  onSubmitName (event) {
    event.preventDefault()
    // TODO : use Meteor call
    /*
    Playlists.update(this.props.playlist._id
                    , {$set: {name: this.state.playlistName}})
    */
    this.props.closeModal()
  }

  onDelete () {
    this.props.openModal({
      title: 'Do you really want to remove the \'' + this.props.playlist.name + '\' playlist?',
      partial: Confirm,
      text: 'Remove playlist',
      buttonClass: 'danger',
      callback: (event) => {
        event.preventDefault()
        // TODO : use Meteor call
        /*
        Playlists.remove(this.props.playlist._id)
        */
        this.props.closeModal()
      }
    })
  }

  render () {
    return <form onSubmit={this.onSubmitName.bind(this)}>
      <FormGroup>
        <ControlLabel>Write the new name of the playlist</ControlLabel>
        <FormControl type='text' onChange={this.onNameChange.bind(this)}
          value={this.state.playlistName} />
      </FormGroup>

      <ButtonToolbar>
        <ButtonGroup>
          <Button type='submit' bsStyle='success'>Edit Playlist</Button>
          <Button onClick={this.props.closeModal}>Cancel</Button>
        </ButtonGroup>

        <ButtonGroup className='pull-right'>
          <Button onClick={this.onDelete.bind(this)} className='small-danger'>Delete</Button>
        </ButtonGroup>
      </ButtonToolbar>
    </form>
  }
}

EditPlaylist.propTypes = {
  playlist: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired
}

export default EditPlaylist
