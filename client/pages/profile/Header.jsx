import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'

import FollowButton from './follow/FollowButton.jsx'

import { Col, Image, Grid, Row, Popover, ButtonToolbar, OverlayTrigger, Button, ButtonGroup, Jumbotron } from 'react-bootstrap'

const popoverClickRootClose = (
  <Popover id='popover-trigger-click-root-close'>
    <ButtonGroup vertical block>
      <Button id='editProfileInfo' block>Edit Profile Info</Button>
      <Button id='editProfileCover' block>Edit Profile Cover</Button>
    </ButtonGroup>
  </Popover>
)

const EditProfile = () => {
  return <Col xs={2} md={2}>
    <ButtonToolbar>
      <OverlayTrigger trigger='click' rootClose placement='bottom' overlay={popoverClickRootClose}>
        <Button>EditProfile</Button>
      </OverlayTrigger>
    </ButtonToolbar>
  </Col>
}

const ThumbnailProfil = ({image}) => {
  return <Col xs={2} md={2}>
    <Image src={image} circle responsive height={134} width={134} />
  </Col>
}

const Header = ({ session, profile }) => {
  const isAuth = session.isAuth
  const ownPage = session.isAuth && session.currentUser._id === profile._id
  const controlContent = ownPage
                          ? <EditProfile />
                          : !isAuth ? ''
                          : <FollowButton currentUser={session.currentUser}
                                          followed={profile}
                                          following={!profile.isSubscribing}/>

  const coverImage = profile.coverImage || '/img/defaultCover.jpg'
  const avatar = profile.image || '/img/defaultAvatar.png'

  return (
    <Jumbotron id='profile' style={{backgroundImage: 'url("' + coverImage + '")'}}>
      <div id='profile-header'>
        <Grid>
          <Row>
            <ThumbnailProfil image={avatar} />
            <Col xs={2} md={8}>
              <h4>{ profile.username }</h4>
            </Col>
            { isAuth ? controlContent : '' }
          </Row>
        </Grid>
      </div>
    </Jumbotron>)
}

export default Header
