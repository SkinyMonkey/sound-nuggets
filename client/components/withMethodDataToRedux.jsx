import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

// TODO : 
// 1 - keep method result in withMethodData state
//    update that state if needed
//
// 2 - when data is fetched, send it to the redux state
//     how to send it to the right state entry?
//     connect the child to redux state externally

// Retrieve data from a meteor method
// The result is stored in the redux state
// Each ComposedComponent is responsible
// for connecting to the store and using the data
const withMethodData = (getData, storeData) => {

  /*
   * TODO : example, remove
   *
   * storeData = dispatchSet(LOAD_TRACKLIST)
  */

  return (ComposedComponent) => {
    class __Component extends Component {
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
          // TODO : if error?
          this.setState({isLoading: false, initialized: true, error})
          this.props.storeData(response)
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
                                  />
      }
    }

    return connect(null, { storeData })(__Component)
  }
}

export default withMethodData
