import { withTracker } from 'meteor/react-meteor-data'

import { Playlists } from '../../imports/api/playlists.js'

import Dropdown from './Dropdown.jsx'

const PlaylistDropdown = withTracker(({profileId, id, onSelect, currentValue}) => {
  // TODO : sort by lastUsed?
  //        5 first and then by name?
  //        a split dropdown?
  const playlists = Playlists.find({owner: profileId}
                                  ,{ sort: { name: 1 } }).fetch()

  return {
    id,
    onSelect,
    keyField: '_id',
    valueField: 'name',
    options: playlists,
    value: currentValue
  }
})(Dropdown)

export default PlaylistDropdown
