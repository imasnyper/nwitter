import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Route, Switch, useParams, useRouteMatch, useHistory } from 'react-router-dom';
import ProfileList from './profileList';
import Header from '../components/header';
import { FOLLOW_PROFILE_MUTATION, PROFILE, PROFILE_DETAILED } from '../gql/profiles';
import { PROFILE_TWEETS } from '../gql/tweets';
import TweetList from '../components/tweetList';
import '../styles/global.css';
import EditProfileModal from '../components/editProfileModal';
import ProfileDetail from '../components/profileDetail';

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
    const { data: profileData, loading: profileLoading, error: profileError } = useQuery(PROFILE_DETAILED, {variables: {profile: viewedUsername}})
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
                            <ProfileDetail 
                                profile={profile}
                                userProfile={userProfile}
                                setShowEditModal={setShowEditModal}
                                handleFollow={handleFollow}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <TweetList setResendQuery={props.setResendQuery} tweets={profileTweets}/>
                        </Col>
                    </Row>
                </Route>
                <Route path={`${path}/following`}>
                    <ProfileList 
                        headerInfo={headerInfo} 
                        followers={profile.following} 
                        userProfile={userProfile}
                        profile={profile}
                        setShowEditModal={setShowEditModal}
                        handleFollow={handleFollow}
                    />
                </Route>
                <Route path={`${path}/followers`}>
                    <ProfileList 
                        headerInfo={headerInfo} 
                        followers={profile.followers} 
                        userProfile={userProfile}
                        profile={profile}
                        setShowEditModal={setShowEditModal}
                        handleFollow={handleFollow}
                    />
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