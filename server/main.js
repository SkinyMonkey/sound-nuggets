// Server entry point, imports all server code

import '/server/config.js'

import '/imports/startup/server'
import '/imports/startup/both'

import '/imports/api/tracks.js'
import '/imports/api/playlists.js'
import '/imports/api/follows.js'
import '/imports/api/accounts.js'

import '/imports/services/youtube.js'
import '/imports/services/sc.js'
import '/imports/services/openwhyd.js'
import '/imports/services/github.js'
