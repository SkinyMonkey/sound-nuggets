import React from 'react'
import { connect } from 'react-redux'

import withMethodData from './withMethodData.jsx'
import Dropdown from './Dropdown.jsx'

const PlaylistDropdown = withMethodData(({ profileId }, done) => {
  Meteor.call('openwhyd.profile.playlists.get', profileId, done)
})((props) => <Dropdown {...props} keyField='_id' valueField='name' options={[ { name: 'None', _id: '' }, ...props.playlists ]} />)

const mapStateToProps = (state) => {
  return {
    profileId: state.session.currentUser._id
  }
}

export default connect(mapStateToProps)(PlaylistDropdown)
