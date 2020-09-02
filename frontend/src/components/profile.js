import React from 'react';
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
    const { data: profileData, loading: profileLoading, error: profileError } = useQuery(PROFILE, {variables: {profile: viewedUsername}})
    const { data: tweetData, loading: tweetLoading, error: tweetError, refresh } = useQuery(PROFILE_TWEETS, {variables: {profile: viewedUsername}}) 

    if(profileLoading || tweetLoading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(profileError || tweetError) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const tweets = tweetData.profileTweets
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
                                <Card.Body>
                                    <Card.Title>
                                        Profile {profile.user.username}
                                    </Card.Title>
                                    <p>Has been a member for {createdTime.from(moment(), true)}</p>
                                    <p><Link to={`${url}/followed`}>Following: {profile.following.length}</Link></p>
                                    <p><Link to={`${url}/followed`}>Followers: {profile.followers.length}</Link></p>
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