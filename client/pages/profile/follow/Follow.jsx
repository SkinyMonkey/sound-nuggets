import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import FollowButton from './FollowButton.jsx'

import { Media } from 'react-bootstrap'

// Follow component - represents a single follow item
export default class Follow extends Component {
  render () {
    const { profileId, follow, session } = this.props

    const name = follow.owner === profileId
                 ? follow.followedName
                 : follow.ownerName

    const image = follow.owner === profileId
                  ? follow.followedImage
                  : follow.ownerImage

    const link = follow.owner === profileId
                 ? '/profile/' + follow.followed + '/tracks'
                 : '/profile/' + follow.owner + '/tracks'

    const followedId = follow.owner === profileId
                        ? follow.followed
                        : follow.owner

    return (
      <Media.ListItem>
        <Media.Left>
          <Link to={link}>
            <img width='110' height='110' src={image} alt='Follow image' className='img-circle' />
          </Link>
        </Media.Left>
        <Media.Body>
          <Media.Heading>
            <Link to={link}>{name}</Link>
          </Media.Heading>
          <Media>
            <Media.Left />
            <Media.Body />
          </Media>

          <div className='control'>
            { !session.isAuth ||
               session.currentUser._id === followedId ? ''
              : <FollowButton currentUser={session.currentUser}
                followedId={followedId}
                            />
            }
          </div>
        </Media.Body>
      </Media.ListItem>
    )
  }
}
