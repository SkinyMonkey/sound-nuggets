import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

import { Button } from 'react-bootstrap'

class FollowButton extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      following: props.following !== undefined
    }

    this.follow = this.follow.bind(this)
    this.unfollow = this.unfollow.bind(this)
  }

  follow (event) {
    const currentUser = this.props.currentUser
    const followed = this.props.followed

    Follows.insert({
      owner: currentUser._id,
      followed: followed._id,
      ownerName: currentUser.profile.username,
      ownerImage: currentUser.profile.image,
      followedName: followed.profile.username,
      followedImage: followed.profile.image
    })

    this.setState({following: true})
  }

  unfollow (event) {
    Follows.remove(this.props.following._id)
    this.setState({following: true})
  }

  render () {
    const callback = this.props.following ? this.unfollow : this.follow
    const content = this.props.following ? 'Following' : 'Follow'
    return <Button onClick={callback}>{content}</Button>
  }
}

// currentUser           : the currentUser
// profileId header      : the followedId is the profileId of the profile we are visiting
// profileId followers   : the followedId is the id of the follow.owner we aim
// profileId following   : the followedId is the id of the follow.followed we aim

// followed               : the followed user
// following              : the entry of follow between the currentUser and the followed

// TODO : how to do that with openwhyd?
export default withTracker(({ currentUser, followedId }) => {
  const followed = Meteor.users.findOne({ _id: followedId }) || {}
  const following = Follows.findOne({ owner: currentUser._id,
    followed: followed._id})

  return {
    currentUser,
    followed,
    following
  }
})(FollowButton)
