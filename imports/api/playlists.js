import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Tracks } from './tracks'

export const Playlists = new Mongo.Collection('playlists')

if (Meteor.isServer) {
  Playlists.after.update((a, updatedDocument) => {
    Tracks.update({playlist: updatedDocument._id}, {$set: {playlistName: updatedDocument.name}}, {multi: true})
  })

  Playlists.after.remove((a, removedDocument) => {
    Tracks.remove({playlist: removedDocument._id})
  })
}
