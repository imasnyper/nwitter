import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Pencil } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

export default function ProfileDetail(props) {
    const history = useHistory();
    const { 
        profile,                      
        userProfile,
        setShowEditModal,
        handleFollow
    } = props;
    const createdTime = moment(profile.created)

    const checkNotFollowing = (userProfile, checkProfile) => {
        const userFollowing = userProfile.following
        const followedUsernames = userFollowing.map(profile => {
            return profile.user.username
        })
        return !followedUsernames.includes(checkProfile.user.username)
    }

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col>
                        <span className="title">
                            Profile {profile.user.username}
                        </span>
                        <span>&nbsp;Has been a member for {createdTime.from(moment(), true)}</span>
                        {userProfile.user.username === profile.user.username    ? 
                            <span className="float-right">
                                <Button 
                                    onClick={() => setShowEditModal(true)} 
                                    variant="warning"
                                >
                                    Edit Profile <Pencil size={18} />
                                </Button>
                            </span>                                     :
                            <></>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className="bold-text">Location:&nbsp;</span><span>{profile.location}</span>
                        <span className="bold-text left-pad-sm">Website:&nbsp;</span><span>{profile.website}</span>
                        <span className="bold-text left-pad-sm">Birthday:&nbsp;</span><span>{profile.birthday}</span>
                    </Col>
                </Row>
                <Row className="top-pad-sm bot-pad-sm">
                    <Col>
                        <span>{profile.bio}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span>
                            <Button 
                                variant="dark"
                                onClick={() => {history.push(`/profiles/${profile.user.username}/following`)}}
                            >
                                <Badge variant="light">{profile.following.length}</Badge> following
                            </Button>
                        </span>
                        <span className="left-pad-sm">
                            <Button 
                                variant="dark" 
                                onClick={() => history.push(`/profiles/${profile.user.username}/followers`)}
                            >
                                <Badge variant="light">{profile.followers.length}</Badge> followers
                            </Button>
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {
                            (userProfile.user.username !== profile.user.username && checkNotFollowing(userProfile, profile))    ? 
                                <Button onClick={handleFollow}>Follow</Button>                                                  : 
                                <></>
                        }
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}