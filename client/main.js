import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

import '../imports/startup/accounts-config.js'
import './subscriptions'

import App from './pages/main/App.jsx'

const store = createStore(reducers, applyMiddleware(thunk))

Meteor.startup(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
      , document.getElementById('render-target'))
})

/* DDP Monitor
if (Meteor.isClient) {
  // log sent messages
  let _send = Meteor.connection._send;
  Meteor.connection._send = function (obj) {
    console.log("send", obj);
    _send.call(this, obj);
  };

  // log received messages
  Meteor.connection._stream.on('message', function (message) {
    console.log("receive", JSON.parse(message));
  });
}
*/
