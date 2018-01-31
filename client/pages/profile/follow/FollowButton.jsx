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

    Meteor.call('openwhyd.profile.following.post', this.props.followed._id, document.cookie)

    this.setState({ following: true })
  }

  unfollow (event) {
    Meteor.call('openwhyd.profile.following.delete', this.props.followed._id, document.cookie)

    this.setState({ following: false })
  }

  render () {
    const callback = this.state.following ? this.unfollow : this.follow
    const content = this.state.following ? 'Following' : 'Follow'

    return <Button onClick={callback}>{content}</Button>
  }
}

export default FollowButton
