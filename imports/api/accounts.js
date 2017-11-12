import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { Playlists } from './playlists.js'

import cookie from 'cookie'

const expired = (c) => {
  const cookies = cookie.parse(c)
  return !cookies['expires'] || Date.now() > Date.parse(cookies['expires'])
}

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}
                            , {fields: { profile: true }})
  } else {
    this.ready()
  }
})

Meteor.publish('allUserData', function () {
  return Meteor.users.find({}, {fields: { profile: true }})
})

if (Meteor.isServer) {
  Accounts.onCreateUser((options, user) => {
    console.log(user)

    if (user.services.facebook) {
      console.log('adding username:', user.services.facebook.name)
      Meteor.users.update({_id: user._id}, {$set: { 'profile.username' : user.services.facebook.name }})
    }

    if (user.services.email) {
      // TODO : on create user in client ... remove username creation
      Meteor.users.update({_id: user._id}, {$set: { 'profile.username' : user.username }})
    }

    if (!user.image) {
      console.log('adding image:', user.image)
      Meteor.users.update({_id: user._id}, {$set: { 'profile.image': '/img/defaultAvatar.png' }});
      Meteor.users.update({_id: user._id}, {$set: { 'profile.coverImage': '/img/defaultCover.jpg' }});
    }

    Playlists.insert({
      owner: user._id,
      name: 'TOSORT',
      isDefault: true
    })

    return user
  })

  // Setup a cookie for facebook if the one stored is expired
  // If the email one is expired setup the relogEmail flag in user row
  Accounts.onLogin((event) => {
    const user = Meteor.user()

    let isExpired = false

    if (!user.openwhyd || (isExpired = expired(user.openwhyd.cookie))) {
      if (user.services.facebook) {
        Meteor.call('openwhyd.connect.facebook'
                   , Meteor.userId())
      }

      if (user.services.password) {
        if (isExpired) {
          console.log('EMAIL/PASSWORD cookie EXPIRED, go relog plz')
          // TODO : setup a flag in database that tell the user to relog
        }
      }
    }
  })

  /*
    TODO : on update, update every follows name and image
  */
}
