// Import client startup through a single index entry point
import React from 'react'
import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor'
import App from '../../ui/App.jsx'

Meteor.startup(() => {
  render(<App />, document.getElementById('app'))
})
