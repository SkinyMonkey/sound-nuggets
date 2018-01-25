import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Meteor } from 'meteor/meteor'
import Autocomplete from 'react-autocomplete'

import { Panel, Media } from 'react-bootstrap'

import modalActions from '../actions/modal.js'
import playerActions from '../actions/player.js'

import AddTrack from '../partials/AddTrack.jsx'
import EditTrack from '../partials/EditTrack.jsx'

const PROVIDERS = ['youtube', 'soundcloud']
const DONETYPINGINTERVAL = 250

const WAITING = 'waiting' // waiting for a new input
const TYPING = 'typing' // user is typing
const LOADING = 'loading' // loading data
const SELECTTRACK = 'selectTrack' // user is selecting a track
const ERROR = 'error'// there was an error while treating data

// Search component - represents the whole app
class Search extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      value: '',
      error: '',
      selected: '',
      loading: false,
      step: WAITING,
      playlistId: this.props.session.defaultPlaylist._id,
      items: [],
      inputTimer: '',
      open: false
    }

    this.onChange = this.onChange.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderInput = this.renderInput.bind(this)

    this.onSelectItem = this.onSelectItem.bind(this)
  }

  componentDidCatch(error, info) {
    console.error('Error:' + __filename + ' ' + error, info)
  }

  pSetState (modifications) {
    return new Promise((resolve, reject) => {
      this.setState((prevState) => {
        return Object.assign({}, prevState, modifications)
      }
      , resolve)
    })
  }

  getPlaylist (playlistId) {
    return Playlists.findOne({ _id: playlistId })
  }

  // User types a direct url in the input
  getTrack (url, parsedUrl, provider) {
    return new Promise((resolve, reject) => {
      Meteor.call(provider + '.metadata', url, (err, data) => {
        if (err) reject(err)
        else {
          this.setState({item: data})
          resolve()
        }
      })
    })
  }

  validURL (url) {
    try {
      const validUrl = new window.URL(url)
      return validUrl
    } catch (e) {
      // TODO : check invalid url is the e.message reason
      return false
    }
  }

  callWithPromise (name, terms, limit) {
    return new Promise((resolve, reject) => {
      Meteor.call(name, terms, limit, (err, data) => {
        if (err) { return reject(err) }
        resolve(data)
      })
    })
  }

  displayOptions (terms) {
    // TODO : check why on backspace the call/render is done right away
    //        instead of waiting for the timer
    //
    //        redo the module correction for autocomplete in a forked repo
    //        and install it
    let addItemCalls = [this.callWithPromise('openwhyd.search', terms, 2)]

    // Data from third party services
    if (this.props.thirdPartyApis !== false) {
      addItemCalls = addItemCalls.concat(PROVIDERS.map((provider) => {
        return this.callWithPromise(provider + '.search', terms, 2)
      }))
    }

    return Promise.all(addItemCalls)
           .then((items) => {
             return this.pSetState({items: [].concat.apply([], items)})
           })
           .then(() => {
             this.pSetState({open: true})
           })
           .catch(console.error)
  }

  getProvider (parsedUrl) {
    return PROVIDERS.reduce((result, provider) => {
      if (parsedUrl.hostname.match(provider)) {
        return provider
      }
      return result
    }, null)
  }

  handleValue (value) {
    let parsedUrl = this.validURL(value)
    if (parsedUrl !== false) {
      const provider = this.getProvider(parsedUrl)

      if (provider !== null) {
        return this.getTrack(value, parsedUrl, provider)
                   .then(() => {
                     return this.pSetState({open: false, value: ''})
                   })
                   .then(() => {
                     this.props.openModal({
                       title: 'Add \'' + this.state.item.name + '\'',
                       item: this.state.item,
                       partial: AddTrack,
                     })
                   })
                   .catch(console.error)
      } else {
        throw new Meteor.Error('Provider is not supported :' + parsedUrl.hostname)
      }
    } else {
      return this.displayOptions(value)
                 .then(() => {
                   return this.pSetState({step: SELECTTRACK})
                 })
    }
  }

  onChange (event, value) {
    this.setState({ value, step: TYPING, error: '' })
    clearTimeout(this.inputTimer)

    if (value !== '') {
      const doneTyping = () => {
        this.pSetState({ step: LOADING, items: [] })
          .then(() => {
            return this.handleValue(this.state.value)
          })
          .catch((e) => {
            console.log(e.message)
            return this.pSetState({
              error: e.message,
              step: ERROR
            })
          })
      }

      this.inputTimer = setTimeout(doneTyping, DONETYPINGINTERVAL)
    }
    else {
      this.setState({open: false})
    }
  }

  openAddTrackModal(item) {
    return this.props.openModal({
      title: 'Add \'' + item.name + '\'',
      item: item,
      partial: AddTrack
    })
  }

  // User selected a track from a list
  onSelectItem (value, item) {
    this.pSetState({open: false, value: ''})
        .then(() => {

          // TODO : clean by factorising
          //        checks and calls
          if (item.type === 'track') {
            if (this.props.session.isAuth === true) {
              if (item.apiProvider === 'openwhyd') {
                return this.callWithPromise('openwhyd.tracks.getOne', item.url)
                           .then((trackUrl) => {
                            return this.openAddTrackModal({
                              ...item,
                              url: trackUrl
                            })
                           })
              }
              return this.openAddTrackModal(item)
            }
            else {
              if (item.apiProvider === 'openwhyd') {
                return this.callWithPromise('openwhyd.tracks.getOne', item.url)
                           .then((trackUrl) => {
                            return this.props.loadPlaylist({
                              url: trackUrl,
                              playlist: [{...item, url: trackUrl}],
                              tracklistURL: '/',
                              playing: true,
                            })
                           })
                           .catch(console.error)
              }

              return this.props.loadPlaylist({
                url: item.url,
                playlist: [{...item, url: trackUrl}],
                tracklistURL: '/',
                playing: true,
              })
              .catch(console.error)
            }
          }
          this.props.history.push(item.url)
        })
        .catch((e) => {
          return this.pSetState({
            error: e.message,
            step: ERROR
          })
        })
  }

  renderItem (item, isHighlighted) {
    const name = item.name.length > 45
                 ? item.name.slice(0, 45) + '...'
                 : item.name

    // Note : new Date is a hack as we don't have access
    //        to a unique key here
    return (<Media className={'search-item-' + isHighlighted}
                   key={item._id + item.provider}>
      <Media.Left>
        <img style={{width: '24px', height: '24px'}} src={item.image} />
      </Media.Left>
      <Media.Body>
        <p >{name}</p>
      </Media.Body>
    </Media>)
  }

  renderItems (htmlItems, value, style) {
    const items = this.state.items

    return htmlItems.map((htmlItem, index) => {
      const item = items[index]
      const provider = item.provider

      if (index === 0 || items[index - 1].provider !== provider) {
        const style = {
          background: '#eee',
          color: '#454545',
          padding: '2px 6px',
          fontWeight: 'bold'
        }
        return [<div key={provider} style={style}>{provider}</div>, htmlItem]
      } else {
        return htmlItem
      }
    })
  }

  renderMenu (items, value, style) {
    return <div id='menu-tracks'>
      <Panel>
        {this.state.step === LOADING && items.length === 0 ? (
          <div style={{ padding: 6 }}>Loading...</div>
         ) : items.length === 0 ? (
          <div style={{ padding: 6 }}>No matches for {value}</div>
         ) : this.renderItems(items)}
      </Panel>
    </div>
  }

  renderInput (props) {
    return <input className='form-control' {...props} />
  }

  render () {
    return (<div id='add-track'>
      <Autocomplete
        wrapperStyle={{width: '100%'}}
        inputProps={{ id: 'search-autocomplete', placeholder: 'Search for a song, artist, genre, etc' }}
        value={this.state.value}
        items={this.state.items}
        getItemValue={(item) => item.name}

        onChange={this.onChange}
        onSelect={this.onSelectItem}

        renderMenu={this.renderMenu}
        renderItem={this.renderItem}
        renderInput={this.renderInput}
        open={this.state.open}
        />
    </div>)
  }
}

Search.propTypes = {
}

const actionProps = {
  ...modalActions,
  ...playerActions,
};

export default connect(null, actionProps)(Search)
