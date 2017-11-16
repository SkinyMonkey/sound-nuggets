import React from 'react'
import { connect } from 'react-redux'

import { Col } from 'react-bootstrap'

import TrackList from './TrackList.jsx'
import Container from '../../../components/Container.jsx'
import SearchWrapper from '../../../components/SearchWrapper.jsx'
import Donate from '../../../components/Donate.jsx'

import withMethodData from '../../../components/withMethodData.jsx'

const DummyContainer = (wrappedComponent) => {
  return (props) => <div className='page-container container'>
    <Col md={7} >
      <div id='page'>
      {React.createElement(wrappedComponent, props)}
      </div>
    </Col>
    <Donate/>
  </div>
}

const tracksFromAPI = withMethodData((props, done) => {
  const profileId = props.match.params.profileId
  const { limit, filter } = props

  const cookie = document.cookie

  Meteor.call('openwhyd.profile.stream.get', limit, cookie, done);
})

// TODO : replace SearchWrapper with a dumb one
const Stream = SearchWrapper(tracksFromAPI(TrackList), 'Stream')

function mapStateToProps (state, ownProps) {
  return {
    ...state.tracklist
  }
}

export default connect(mapStateToProps)(DummyContainer(Stream))
