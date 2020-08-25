import React, { useState, useEffect } from 'react';
import usePersistentState from '../lib/persistentState';
import { useParams, useRouteMatch, Switch, Link, Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { PROFILE_TWEETS } from '../gql/tweets'
import { PROFILE } from '../gql/users';
import Tweets from './tweets';
import Header from './header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import Followed from './followed';

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
    const [id, setID] = useState("")

    useEffect(() => {
        async function getViewedProfileID(username) {
            const viewedProfileID = await fetch(
                `http://localhost:8000/get-profile-uuid/${username}/`, {
                    headers: {
                        "Authorization": `Token ${props.authToken}`
                    }
                }
                ).then(response => { response.text().then(text => { setID(text) }) })
        }

        getViewedProfileID(viewedUsername)
    }, [])

    const { data: profileData, loading: profileLoading, error: profileError } = useQuery(PROFILE, {variables: {id: id}}) 
    const { data: tweetData, loading: tweetLoading, error: tweetError, refresh } = useQuery(PROFILE_TWEETS, {variables: {profile: id}})

    if(profileLoading || tweetLoading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(profileError || tweetError) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const tweets = tweetData.profileTweets.edges
    const profile = profileData.profile
    
    const createdTime = moment(profile.created)

    const headerInfo = {
        resendQuery: props.resendQuery, 
        setResendQuery: props.setResendQuery, 
        username: props.username, 
        handleLogout: props.handleLogout,
        handleTime: props.handleTime
    }

    return (
        <Container fluid>
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
                                <Card.Title>
                                    <h1>Profile {profile.user.username}</h1>
                                </Card.Title>
                                <Card.Body>
                                    <p>Has been a member for {createdTime.from(moment(), true)}</p>
                                    <p><Link to={`${url}/followed`}>Following: {profile.following.edges.length}</Link></p>
                                    <p><Link to={`${url}/followed`}>Followers: {profile.followers.edges.length}</Link></p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                    <Col xs={12}>
                        <Tweets tweets={tweets} />
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