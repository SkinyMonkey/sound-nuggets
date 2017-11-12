import React, { Component } from 'react'

import { Panel, FormControl, FormGroup, Col } from 'react-bootstrap'

const DONETYPINGINTERVAL = 250

// We use the browser API directly:
// react-router reloads the page
// even if we only change the query
const addQueryParameter = (name, value) => {
  const { protocol, host, pathname } = window.location;
  const newurl = protocol + "//" + host + pathname + '?' + name + '=' + value;
  window.history.pushState({ path: newurl }, '', newurl);
}

const removeQueryParameter = (name, value) => {
  const { protocol, host, pathname } = window.location;
  const newurl = protocol + "//" + host + pathname;
  window.history.pushState({ path: newurl }, '', newurl);
}

const parseQuery = (search) => {
  return _.object(_.compact(_.map(search.slice(1).split('&'), (item) => {  if (item) return item.split('=')})))
}

const searchWrapper = (WrappedComponent, title) => {
  return class SearchWrapper extends Component {
    constructor (props, context) {
      super(props, context)

      const query = parseQuery(props.location.search)

      this.state = {
        value: query.search || '',
        filter: query.search ? this.filter(query.search) : ''
      }

      this.onChange = this.onChange.bind(this)
    }

    filter(value) {
      //return new RegExp('.*' + value + '.*', 'i')
      return value
    }

    onChange (event) {
      const value = event.target.value
      this.setState({value: value})
      clearTimeout(this.inputTimer)

      const doneTyping = () => {
        if (value !== '') {
          addQueryParameter('search', value)
          this.setState({filter: this.filter(this.state.value) })
        }
        else {
          removeQueryParameter('search', value)
          this.setState({ filter: '' })
        }
      }
      this.inputTimer = setTimeout(doneTyping, DONETYPINGINTERVAL)
    }

    render () {
      const panelTitle = (
        <FormGroup>
          <Col xs={2} md={2} id='search-wrapper-title'>
            <h5>{title}</h5>
          </Col>
          <Col>
            <FormControl id='search-wrapper' type='text' onChange={this.onChange} value={this.state.value} placeholder='Filter' />
          </Col>
        </FormGroup>
      )

      return <Panel header={panelTitle} id='search-wrapper'>
        {this.state.filter !== ''
         ? React.createElement(WrappedComponent, {filter: this.state.filter, ...this.props})
         : React.createElement(WrappedComponent, {...this.props})
        }
      </Panel>
    }
  }
}

export default searchWrapper
