import { Mongo } from 'meteor/mongo'

export const Tracks = new Mongo.Collection('tracks')

// TODO : on track remove, if last in playlist, update image to next track image
//        on track insert, if originalTrack
//                          increment original track added counter
//                          set lastAdded to now
//                         update playlist cover
//
/* Tracks.update({Id: newTrack.originalTrack}
                 ,{$inc: {added : 1}, $set: {lastAdded: new Date()}});
  //Playlists.update({Id: playlist._id}, {$set: {image: newTrack.image}});
*/
