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
        console.log('Mounting : ', ComposedComponent.displayName)
      }
 
      componentWillUnmount () {
        console.log('Unmounting : ', ComposedComponent.displayName)
      }

      render () {
        return !this.state.initialized ? <div>Loading</div> :
               <ComposedComponent {...this.props}
                                  {...this.state}
                                  {...this.state.response}/>
      }
    }
  }
}

export default withMethodData
