import fetch from 'node-fetch'
import md5 from 'md5'

import _ from 'lodash'

if (Meteor.isServer) {

const API_URL = 'https://openwhyd.org'
// const API_URL = 'http://localhost:8080' // For local testing

/*
  This service is abstracting the communication with the openwhyd api.
*/

// Api calls functions
const searchParams = (params) => {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&')
}

const HEADERS = {
  'Origin': API_URL,
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,enq=0.8,frq=0.6',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'sound-nuggets-frontend',
  'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
  'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,image/webp,image/apng,*/*q=0.8',
  'Cache-Control': 'max-age=0',
  'Referer': API_URL + '/login?action=logout',
  'Connection': 'keep-alive'
}

const dateFromObjectId = (objectId) => {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
}

const post = (url, data, config = {}) => {
  const form = searchParams(data)
  const options = {
    ...config,
    body: form,
    method: 'POST',
    headers: {...HEADERS, ...config.headers}
  }

  return fetch(url, options)
}

const get = (url, config = {}) => {
  const options = {
    ...config,
    method: 'GET',
    headers: {...HEADERS, ...config.headers}
  }

  return fetch(url, options)
}

const emptyPredicate = () => {
//  throw new Error('Empty predicate')
  return true
}

const checkPredicate = (predicate) => {
  return (json) => {
   if (predicate(json) === false) {
     throw new Error(JSON.stringify(json))
   }
   return json
  }
}

const getWithCookie = (url, cookie, predicate = emptyPredicate) => {
  const headers = {'Cookie': cookie}

  return get(url, {headers})
            .then((result) => result.json())
            .then(checkPredicate(predicate))
}

const postWithCookie = (url, data, cookie, predicate = emptyPredicate) => {
  const headers = {'Cookie': cookie}

  return post(url, data, {headers})
            .then((result) => result.json())
            .then(checkPredicate(predicate))
}

// TODO : set the cookie in a redis instance?
//        would avoid some requests, no db needed

const convertUser = (result, json) => {
  const playlists = json.user.pl || []
  const image = json.user.img.indexOf('graph') > -1 ?
                json.user.img :  
                `${API_URL}${json.user.img}`

  return {
    currentUser: {
      _id: json.user._id,
      username: json.user.name,
      image
    },
    playlists: playlists.map((playlist) => {return {_id: playlist.id
                                                   ,name: playlist.name}}),
    username: json.user.name,
    defaultPlaylist: {}, //TODO ??
 	  cookie: result.headers.get('set-cookie'),
  }
}

const jsonToUser = (result) => (json) => {
  const cookie = result.headers.get('set-cookie')
  if (json.user && cookie) {
    return convertUser(result, json)
  }

  if (json.result.startsWith('nok')) {
    if (json.result.indexOf('not found') > -1) {
      return { error: 'Register on openwhyd.org' }
    }

    return { error: json.result }
  }

//  if (!cookie) return { error: 'No cookie returned by the server' }
  return { error: json.error }
}

const emailLogin = (email, password) => {
 const loginUrl = API_URL + '/login'

 return post(loginUrl, {
   action: 'login',
   ajax: true,
   email: email,
   md5: md5(password),
   includeUser: true
 })
 .then((result) => {
	return result.json().then(jsonToUser(result))
 })
 .catch(console.error)
}

const facebookLogin = (facebookId, accessToken) => {
  const url = `${API_URL}/facebookLogin?action=login`

  return post(url, {
    ajax: true,
    fbUid: facebookId,
    fbAccessToken: accessToken,
    includeUser: true
  })
  .then((result) => {
	 return result.json().then(jsonToUser(result))
  })
  .catch((e) => {
    console.error(e)
    return false
  })
}

const eidTable = {
  'sc': 'https://soundcloud.com/',
  'yt': 'https://www.youtube.com/watch?v=',
}

const providerTable = {
  'sc': 'soundcloud',
  'yt': 'youtube',
}

const eIdToURL = (spliteid) => {
  const provider = spliteid[1]

  if (provider == 'sc') { // TODO : more generic system?
    spliteid = spliteid.join('/').split('#')[0].split('/')
  }

  return eidTable[provider] + spliteid.slice(2).join('/')
}

//urlPrefix: '//youtube.com/watch?v=',
//urlPrefix: '//soundcloud.com/',
//urlPrefix: '//dailymotion.com/video/',
//urlPrefix: '//vimeo.com/',
const urlEidConversionTable = {
	'yt': (url) => {
		return (url.match(/(youtube\.com\/(v\/|embed\/|(?:.*)?[\?\&]v=)|youtu\.be\/)([a-zA-Z0-9_\-]+)/) || []).pop();
	},
	'sc': (url) => {
		return (url.indexOf('soundcloud.com/player') != -1 ? (url.match(/url=([^&]*)/) || []).pop() : null)
			|| (url.match(/https?:\/\/(?:www\.)?soundcloud\.com\/([\w-_\/]+)/) || []).pop()
	},
	'dm': (url) => {
		return (url.match(/https?:\/\/(?:www\.)?dailymotion.com(?:\/embed)?\/video\/([\w-]+)/) || []).pop()
	},
	'vi': (url) => {
		return (url.match(/https?:\/\/(?:www\.)?vimeo\.com\/(clip\:)?(\d+)/) || []).pop()
	}
}

const urlToEid = (url) => {
  return _.reduce(urlEidConversionTable, (result, extractId, key) => {
		const eId = extractId(url)
		if (!result && eId) {
			return `/${key}/${eId}`
		}
		return result
  }, '')
}

const getProvider = (eId) => {
	if (eId.startsWith('/yt/')) {
		return 'youtube'
	}
	if (eId.startsWith('/sc/')) {
		return 'soundcloud'
	}
	return ''
}

const toOpenwhydSrc = (url) => {
  return {
    'src[id]': '',
    'src[name]': '',
    eId: urlToEid(url),
  }
}

const convertTrack = (openwhydTrack) => {
	if (!openwhydTrack) return {}
	return {
		_id: openwhydTrack._id,
		createdAt: dateFromObjectId(openwhydTrack._id),
		owner: openwhydTrack.uId,
		ownerName: openwhydTrack.uNm,
    ownerImage: `${API_URL}/img/u/${openwhydTrack.uId}`,
		playlist: openwhydTrack.pl ? openwhydTrack.pl.id : '',
		playlistName: openwhydTrack.pl ? openwhydTrack.pl.name : '',
		name: openwhydTrack.name,
		url: eIdToURL(openwhydTrack.eId.split('/')),
		provider: getProvider(openwhydTrack.eId),
		image: openwhydTrack.img,
		originalOwner : null,
		originalOwnerName : '',
	}
}

const convertHotTrack = (track) => {
 return {
  ...convertTrack(track),
  position: track.prev === undefined || track.prev === track.score ? '=' :
            track.score > track.prev ? '>' : '<'
 }
}

const convertFollower = (follower) => {
  return {
    owner: follower.uId,
    ownerName: follower.uNm,
    ownerImage: `${API_URL}/img/u/${follower.uId}?width=100&height=100`
  }
}

const convertFollowed = (profileId) => {
  return (followed) => {
    return {
      owner: profileId,
      followed: followed.tId,
      followedName: followed.tNm,
      followedImage: `${API_URL}/img/u/${followed.tId}?width=100&height=100`
    }
  }
}

const convertSearchUrl = (url) => {
  const splitUrl = url.split('/')
  if (splitUrl[1] === 'u') {
    if (splitUrl[3] === 'playlist') {
      return `/profile/${splitUrl[2]}/playlists/${splitUrl[4]}`
    }
    return `/profile/${splitUrl[2]}/tracks`
  }

  return url
}

const getTrack = (openwhydUrl) => {
  const url = `${API_URL}${openwhydUrl}`
  return get(url)
          .then((result) => result.json())
          .then((track) => {
            return track.data.src.id
          })
          .catch(console.error)
}

// /c/ -> getTrackURL?
// /t/ ? -> getTrackURL?
const convertSearch = (limit) => {
  return (items, provider, type) => {
    if (!items) return []
    return items.slice(0, limit).map((item) => {
      const image = item.img.search('http') > -1 ?
                    item.img :
                    `${API_URL}${item.img}`

      return {
        apiProvider: 'openwhyd',
        _id: item.id,
        name: item.name,
        url: convertSearchUrl(item.url),
        image,
        provider,
        type,
      }
    })
  }
}

Meteor.methods({
  'openwhyd.login.email': emailLogin,
  'openwhyd.login.facebook': facebookLogin,

	'openwhyd.logout': (cookie) => {
		const url = `${API_URL}/login?action=logout&ajax=true&format=true`

		return getWithCookie(url, cookie)
								.catch(console.error)
	},

	'openwhyd.user.current.get': (cookie) => {
		const url = `${API_URL}/api/user`

    const image = json.img.indexOf('graph') > -1 ?
                  json.img :  
                  `${API_URL}${json.img}`

		return getWithCookie(url, cookie)
		          .then((json) => {
								return {
                  currentUser: {
                    _id: json._id,
                    username: json.name,
                    image
                  },
                  playlists: json.pl,
                  username: json.name,
                  defaultPlaylist: {}, //TODO ??
                  isAuth: true,
								}
							})
		          .catch(console.error)
	},

  'openwhyd.profile.tracks.post': (track, cookie) => {
		const url = `${API_URL}/api/post`
		const openwhydSrc = toOpenwhydSrc(track.url)

		const trackForm = {
			...openwhydSrc,
			'name': track.name,
			'img': track.image,
			'ctx': 'bk',
			'text': '',
			'pl[id]': track.playlist,
			'pl[name]': track.playlistName,
			'action': 'insert',
		}

		return postWithCookie(url, trackForm, cookie)
			.catch(console.error)
	},

	'openwhyd.profile.tracks.update': (track, playlistId, playlistName, cookie) => {
		const url = `${API_URL}/api/post`
		const openwhydSrc = toOpenwhydSrc(track.url)
	
		const trackForm = {
			...openwhydSrc,
			'_id': track._id,
			'name': track.name,
			'img': track.image,
			'ctx': 'bk',
			'text': '',
			'pl[id]': playlistId,
			'pl[name]': playlistName,
			'action': 'insert',
		}
	
		return postWithCookie(url, trackForm, cookie)
			.catch(console.error)
	},

  'openwhyd.profile.tracks.delete': (trackId, cookie) => {
    const url = `${API_URL}/api/post?action=delete&_id=${trackId}`
    const trackForm = {
      action : 'delete',
      _id: trackId
    }

    return postWithCookie(url, trackForm, cookie)
            .catch(console.error)
  },

  'openwhyd.profile.stream.get': (limit, cookie) => {
    const url = `${API_URL}/?format=json&limit=${limit}`

    return getWithCookie(url, cookie, _.isArray)
		          .then((json) => {
                return {
                  tracks: json.map(convertTrack)
                }
              })
              .catch(console.error)
  },

  'openwhyd.profile.playlists.post': (trackName, cookie) => {
    const playlistForm = {
      action : 'create',
      name: ''
    }

    return postWithCookie(url, playlistForm, cookie)
              .then(console.log)
              .catch(console.error)
  },

  'openwhyd.profile.playlists.update': (playlistId, name, cookie) => {
    const playlistForm = {
      action : 'rename',
      id: playlistId,
      name
    }

    return postWithCookie(url, playlistForm, cookie)
              .then(console.log)
              .catch(console.error)
  },

  'openwhyd.profile.playlists.delete': (playlistId, cookie) => {
    const playlistForm = {
      action : 'delete',
      id: playlistId
    }

    return postWithCookie(url, playlistForm, cookie)
              .then(console.log)
              .catch(console.error)
  },

  'openwhyd.profile.following.post': (followedId, cookie) => {
    const query = `?action=insert&tId=${followedId}&_=${Date.now()}`
    const url = `${API_URL}/api/follow${query}`

    return getWithCookie(url)
              .then(console.log)
              .catch(console.error)
  },

  'openwhyd.profile.following.delete': (profileId, limit) => {
    const query = `?action=delete&tId=${followedId}&_=${Date.now()}`
    const url = `${API_URL}/api/follow${query}`

    return getWithCookie(url)
              .then(console.log)
              .catch(console.error)
  },

  // public
  'openwhyd.search': (keywords, limit) => {
    // TODO : with and without cookie?
    const url = `${API_URL}/search?q=${keywords}&format=json&context=header&_=${Date.now()}`

    let limitedConvertSearch = convertSearch(limit)

    return get(url)
            .then((result) => result.json())
            .then((json) => {
              return [
                ...limitedConvertSearch(json.results.user, 'user', 'user'),
                ...limitedConvertSearch(json.results.track, 'track', 'track'),
                  ...limitedConvertSearch(json.results.post, 'post', 'track'),
                ...limitedConvertSearch(json.results.playlist, 'playlist', 'playlist'),
              ]
            })
            .catch(console.error)
  },

  // tracks
  'openwhyd.tracks.getOne': (openwhydUrl) => {
    const url = `${API_URL}${openwhydUrl}?format=json`

    // TODO : convert from eId to URL
    // FIXME : what to do if track cannot be found?
    // and why would i get a stranger result like this?
    // algolia index not up to date?

    return get(url)
            .then((result) => result.json())
            .then((track) => {
              return eIdToURL(track.eId.split('/'))
            })
            .catch(console.error)
  },

  'openwhyd.profile.tracks.hot.get': (limit, genre) => {
    const url = genre ?
                `${API_URL}/hot/${genre}?format=json` :
                `${API_URL}/hot?format=json&limit=${limit}`

    return get(url)
          		.then((result) => result.json())
		          .then((json) => {
                return {
                  limit,
                  tracks: json.tracks.map(convertHotTrack)
                }
              })
              .catch(console.error)
  },

  'openwhyd.profile.tracks.get': (profileId, limit, filter) => {
		const url = filter ?
                `${API_URL}/search?q=${filter}&uid=${profileId}&format=json&_=${Date.now()}` :
                `${API_URL}/u/${profileId}?format=json&limit=${limit}`

		return get(url)
          		.then((result) => result.json())
		          .then((json) => {
								return {
									profileId,
									limit,
									tracks: filter ? json.results.map(convertTrack).slice(0, limit + 1) :
																	 json.map(convertTrack),
								}
							})
		          .catch(console.error)
	},

  // user
	'openwhyd.profile.user.get': (profileId) => {
		const url = `${API_URL}/api/user?id=${profileId}&includeSubscr=true&countPosts=true`

		return get(url)
          		.then((result) => result.json())
		          .then((json) => {
								const image = json.img.search('graph') > -1 ?
															'http:' + json.img :
															`${API_URL}${json.img}`

								const coverImage = `${API_URL}${json.cvrImg}`

								return {
									profileId,
									profile: {
										_id: json._id,
										username: json.name,
                  	image,
										coverImage,
										localisation: json.loc,
										biography: json.bio,
										stats: {
											tracks: json.nbPosts,
											playlists: json.pl.length,
											followers: json.nbSubscribers,
											following: json.nbSubscriptions,	
										}
									}
								}
							})
		          .catch(console.error)
	},

  // playlists
  'openwhyd.profile.playlists.get': (profileId) => {
		const url = `${API_URL}/api/user?id=${profileId}`

		return get(url)
          		.then((result) => result.json())
		          .then((json) => {
								return {
									profileId,
								  playlists: json.pl.map((playlist) => {
                    const playlistUid = playlist.url.split('/')[2] + '_' + playlist.id
                    return {
                      _id: playlist.id,
                      name: playlist.name,
                      image: `${API_URL}/img/playlist/${playlistUid}`,
                      tracksNbr: playlist.nbTracks,
                      isDefault: false
                    }
                  }).sort((a, b) => {
                    return a.name < b.name ? -1 :
                           a.name > b.name ?  1 : 0
                  })
								}
							})
		          .catch(console.error)
  },

  'openwhyd.profile.playlists.tracks.get': (profileId, playlistId, limit, filter) => {
		const url = `${API_URL}/u/${profileId}/playlist/${playlistId}?format=json&limit={limit}`

		return get(url)
          		.then((result) => result.json())
		          .then((json) => {
                return {
                  profileId,
                  limit,
                  tracks: json.map(convertTrack).slice(0, limit + 1)
                }
							})
		          .catch(console.error)
  },

  // followers
  'openwhyd.profile.followers.get': (profileId, limit, filter) => {
    const url = `${API_URL}/api/follow/fetchFollowers/${profileId}`

		return get(url)
          		.then((result) => result.json())
              .then((json) => {
                return {
                  profileId,
                  limit,
                  follows: json.map(convertFollower)
                }
							})
		          .catch(console.error)
  },

  // following
  'openwhyd.profile.following.get': (profileId, limit, filter) => {
    const url = `${API_URL}/api/follow/fetchFollowing/${profileId}`

		return get(url)
          		.then((result) => result.json())
		          .then((json) => {
                return {
                  profileId,
                  limit,
                  follows: json.map(convertFollowed(profileId))
                }
							})
		          .catch(console.error)
  },    
})
}
