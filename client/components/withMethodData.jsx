import React, { Component } from 'react'
import _ from 'lodash'

const withMethodData = (getData) => {
  return (ComposedComponent) => {
    return class Component extends Component {
      constructor (props) {
        super(props)

        this.state = {
          isLoading: true,
          initialized: false,
        }
      }

      fetchData (props) {
        this.setState({isLoading: true})
        getData(props, (error, response) => {
          this.setState({isLoading: false, initialized: true, response, error})
        })
      }

      componentWillReceiveProps (nextProps) {
        if (!_.isEqual(this.props, nextProps)) {
          this.fetchData(nextProps)
        }
      }

      componentWillMount () {
        this.fetchData(this.props)
      }
 
      render () {
        return !this.state.initialized ?
               <div className='loading'>Loading</div> :
               <ComposedComponent {...this.props}
                                  {...this.state}
                                  {...this.state.response}/>
      }
    }
  }
}

export default withMethodData
