import { useMutation } from '@apollo/client';
import moment from 'moment';
import React, { useState } from 'react';
import { ArrowRepeat } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { LIKE_TWEET_MUTATION, RETWEET_TWEET_MUTATION } from '../gql/tweets';
import ErrorToast from './errorToast';
import RetweetModal from './retweetModal';

export default function Tweet(props) {
    const { tweet, setResendQuery } = props
    const [showError, setshowError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    console.log(props)

    const [ likeTweet, {error: tweetError} ] = useMutation(LIKE_TWEET_MUTATION, {onError: () => {setshowError(true)}})
    const [ retweetTweet, {error: retweetError} ] = useMutation(RETWEET_TWEET_MUTATION, {onError: () => {setshowError(true)}})
    
    const handleLike = () => {
        likeTweet({variables: {id: tweet.id}})
        setResendQuery(true);
    }

    return (
        <>
            <ErrorToast show={showError} setShow={setshowError} error={tweetError}/>
            <Card className="tweet-card">
                <Card.Body>

                    <Card.Title>
                        <span><Link to={`/profiles/${tweet.profile.user.username}`}>{tweet.profile.user.username}</Link></span>
                        <span style={{fontStyle: "normal", fontSize: ".75rem"}}>&nbsp;-&nbsp;tweeted {moment(tweet.created).fromNow()}</span>
                    </Card.Title>

                    <Card.Text>
                        {tweet.text}
                    </Card.Text>
                    <span style={{paddingRight: ".5rem"}}>
                        <Button onClick={handleLike}>
                            ❤ <Badge variant="light">{tweet.likes.length}</Badge>
                        </Button>
                    </span>
                    <span>
                        <Button onClick={() => setShowModal(true)}>
                            <ArrowRepeat size={22}/> <Badge variant="light">{tweet.retweets.length}</Badge>
                        </Button>
                    </span>
                </Card.Body>
            </Card>
            <RetweetModal show={showModal} onHide={() => setShowModal(false)} tweet={tweet} setShowModal={setShowModal} setResendQuery={props.setResendQuery}/>
        </>
    )
}