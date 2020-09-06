import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import Followed from '../components/followed';
import Header from '../components/header';
import Tweets from '../components/tweets';
import { FOLLOW_PROFILE_MUTATION, PROFILE } from '../gql/profiles';
import { PROFILE_TWEETS } from '../gql/tweets';

const removeTrailingSlash = url => { 
    if(url.length - 1 === url.lastIndexOf('/')) {
        return url.substring(0, url.length - 1)
    }
    return url
}

export default function Profile(props) {
    const { username: viewedUsername } = useParams();
    let { path, url } = useRouteMatch();
    url = removeTrailingSlash(url)
    const { data: userProfileData, loading: userProfileLoading, error: userProfileError } = useQuery(PROFILE, {variables: {profile: props.username}})
    const { data: profileData, loading: profileLoading, error: profileError, refetch: profileRefetch } = useQuery(PROFILE, {variables: {profile: viewedUsername}})
    const { data: tweetData, loading: tweetLoading, error: tweetError, fetchMore } = useQuery(PROFILE_TWEETS, {variables: {profile: viewedUsername}}) 
    const [ followProfile, {error}] = useMutation(FOLLOW_PROFILE_MUTATION, {onError: () => {}})

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
        }
    }

    const loadMore = () => {
        setAfter(after + 10)
        fetchMore({
            variables: {
                after: after + 10
            },
            updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult) {
                    setAfter(after - 10)
                    return prev;
                }
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

    const tweets = tweetData.profileTweets
    const profile = profileData.profile
    const userProfile = userProfileData.profile

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
                                    <Card.Title>
                                        Profile {profile.user.username}
                                    </Card.Title>
                                    <p>Has been a member for {createdTime.from(moment(), true)}</p>
                                    <p><Link to={`${url}/followed`}>Following: {profile.following.length}</Link></p>
                                    <p><Link to={`${url}/followed`}>Followers: {profile.followers.length}</Link></p>
                                    {(userProfile.user.username !== viewedUsername && checkNotFollowing(userProfile, viewedUsername)) ? <Button onClick={handleFollow}>Follow</Button> : <></>}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Tweets setResendQuery={props.setResendQuery} tweets={tweets} />
                        </Col>
                    </Row>
                </Route>
                <Route path={`${path}/followed`}>
                    <Followed headerInfo={headerInfo} following={profile.following} followers={profile.followers} />
                </Route>
            </Switch>
        </Container>
    )
}