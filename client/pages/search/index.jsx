import React, { Component } from 'react'

// TODO : put in common file
const parseQuery = (search) => {
  return _.object(_.compact(_.map(search.slice(1).split('&'), (item) => {  if (item) return item.split('=')})))
}

// TODO : display every search results
class EveryResults extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  pSetState (modifications) {
    return new Promise((resolve, reject) => {
      this.setState((prevState) => {
        return Object.assign({}, prevState, modifications)
      }
      , resolve)
    })
  }

  callWithPromise (name, terms, limit) {
    return new Promise((resolve, reject) => {
      Meteor.call(name, terms, limit, (err, data) => {
        if (err) { return reject(err) }
        resolve(data)
      })
    })
  }

  componentDidMount() {
    const query = parseQuery(this.props.location.search)
    const terms = query.search

    console.log(terms)

    this.callWithPromise('openwhyd.search', terms, 30)
        .then((items) => {
          console.log('items:', items)
          return this.pSetState({ items });
        })
        .catch(console.error)
  }

  render() {
    // SideMenu
    // Based on SideMenu, display different panel
    return <div></div> 
  }
}

export default EveryResults
