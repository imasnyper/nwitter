import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Pencil } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import { Link, Route, Switch, useParams, useRouteMatch, useHistory } from 'react-router-dom';
import Followed from '../components/followed';
import Header from '../components/header';
import { FOLLOW_PROFILE_MUTATION, PROFILE } from '../gql/profiles';
import { PROFILE_TWEETS } from '../gql/tweets';
import TweetList from '../components/tweetList';
import '../styles/global.css';
import EditProfileModal from '../components/editProfileModal';

const removeTrailingSlash = url => { 
    if(url.length - 1 === url.lastIndexOf('/')) {
        return url.substring(0, url.length - 1)
    }
    return url
}

export default function Profile(props) {
    const { username: viewedUsername } = useParams();
    let { path, url } = useRouteMatch();
    const history = useHistory();
    url = removeTrailingSlash(url)
    const { data: userProfileData, loading: userProfileLoading, error: userProfileError } = useQuery(PROFILE, {variables: {profile: props.username}})
    const { data: profileData, loading: profileLoading, error: profileError } = useQuery(PROFILE, {variables: {profile: viewedUsername}})
    const { data, loading: tweetLoading, error: tweetError, fetchMore } = useQuery(PROFILE_TWEETS, {variables: {profile: viewedUsername}}) 
    const [ followProfile ] = useMutation(FOLLOW_PROFILE_MUTATION, {onError: () => {}})
    const [ showEditModal, setShowEditModal ] = useState(false);


    const [after, setAfter] = useState(0);
    const containerRef = useRef(null);

    const isBottom = el => {
        if (!el) return
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    const trackScrolling = () => {
        const element = containerRef.current
        if(isBottom(element)) {
            loadMore()
            console.log("at bottom loading more")
        }
        
    }

    const loadMore = () => {
        
        fetchMore({
            variables: {
                after: after + 10
            },
            updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult || fetchMoreResult.profileTweets.length === 0 ) {
                    return prev;
                }
                setAfter(after + 10)
                return Object.assign({}, prev, {
                    profileTweets: [...prev.profileTweets, ...fetchMoreResult.profileTweets]
                });
            }
        })
    }

    useEffect(() => {
        document.addEventListener('scroll', trackScrolling)
        return () => document.removeEventListener('scroll', trackScrolling)
    })

    if(profileLoading || tweetLoading || userProfileLoading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(profileError || tweetError || userProfileError) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const profileTweets = data.profileTweets
    const profile = profileData.profile
    const userProfile = userProfileData.profile

    console.log(profile)

    const createdTime = moment(profile.created)

    const headerInfo = {
        resendQuery: props.resendQuery, 
        setResendQuery: props.setResendQuery, 
        username: props.username, 
        handleLogout: props.handleLogout,
        handleTime: props.handleTime
    }


    const handleFollow = () => {
        followProfile({variables: {id: profile.id}})
        // profileRefetch()
    }

    const checkNotFollowing = (userProfile, checkProfile) => {
        const userFollowing = userProfile.following
        const followedUsernames = userFollowing.map(profile => {
            return profile.user.username
        })
        return !followedUsernames.includes(checkProfile)
    }

    console.log(after)

    return (
        <Container ref={containerRef} fluid>
            <Switch>
                <Route exact path={path}>
                    <Row>
                        <Col xs={12}>
                            <Header headerInfo={headerInfo} />
                        </Col>
                    </Row>
                    <Row style={{paddingBottom: "1rem"}}>
                        <Col xs={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <span className="title">
                                                Profile {profile.user.username}
                                            </span>
                                            <span>&nbsp;Has been a member for {createdTime.from(moment(), true)}</span>
                                            {userProfile.user.username == viewedUsername    ? 
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
                                                    onClick={() => {history.push(`${url}/followed`)}}
                                                >
                                                    <Badge variant="light">{profile.following.length}</Badge> following
                                                </Button>
                                            </span>
                                            <span className="left-pad-sm">
                                                <Button 
                                                    variant="dark" 
                                                    onClick={() => history.push(`${url}/followed`)}
                                                >
                                                    <Badge variant="light">{profile.followers.length}</Badge> followers
                                                </Button>
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {
                                                (userProfile.user.username !== viewedUsername && checkNotFollowing(userProfile, viewedUsername))    ? 
                                                    <Button onClick={handleFollow}>Follow</Button>                                                  : 
                                                    <></>
                                            }
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <TweetList setResendQuery={props.setResendQuery} tweets={profileTweets}/>
                        </Col>
                    </Row>
                </Route>
                <Route path={`${path}/followed`}>
                    <Followed headerInfo={headerInfo} following={profile.following} followers={profile.followers} />
                </Route>
            </Switch>
            <EditProfileModal 
                profile={profile} 
                show={showEditModal} 
                setShowModal={setShowEditModal}
                onHide={() => setShowEditModal(false)} 
                setResendQuery={props.setResendQuery} 
            />
        </Container>
    )
}