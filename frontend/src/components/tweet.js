import { useMutation } from '@apollo/client';
import moment from 'moment';
import React, { useState } from 'react';
import { ArrowRepeat } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { LIKE_TWEET_MUTATION } from '../gql/tweets';
import ErrorToast from './errorToast';
import RetweetModal from './retweetModal';
import { useHistory } from 'react-router-dom';
import TweetsAndRetweets from './tweetsAndRetweets';

export default function Tweet(props) {
    const { tweet, setResendQuery } = props
    const [showError, setshowError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    const [ likeTweet, {error: tweetError} ] = useMutation(LIKE_TWEET_MUTATION, {onError: () => {setshowError(true)}})
    
    const handleLike = e => {
        likeTweet({variables: {id: tweet.id}})
        setResendQuery(true);
    }

    const handleTweetClick = e => {
        e.stopPropagation();
        history.push(`/tweet/${tweet.id}`);
    }

    const handleRetweet = e => {
        e.stopPropagation();
        setShowModal(true);
    }

    return (
        <>
            <ErrorToast show={showError} setShow={setshowError} error={tweetError}/>
            <Card 
                onClick={e => handleTweetClick(e)} 
                className="tweet-card" 
                style={{cursor: "pointer"}}
            >
                <Card.Body>
                    {tweet.isReply                      ? 
                        <Card.Text>in response to <Link onClick={e => e.stopPropagation()} to={`/tweet/${tweet.replyTo.id}`}>{tweet.replyTo.profile.user.username}</Link></Card.Text>
                                                        :
                        <></>
                    }
                    <Card.Title>
                        <span>
                            <Link 
                                onClick={e => e.stopPropagation()} 
                                to={`/profiles/${tweet.profile.user.username}`}
                            >
                                {tweet.profile.user.username}
                            </Link>
                        </span>
                        <span style={{fontStyle: "normal", fontSize: ".75rem"}}>
                            &nbsp;-&nbsp;tweeted {moment(tweet.created).fromNow()}
                        </span>
                    </Card.Title>
                    <Card.Text>
                        {tweet.text}
                    </Card.Text>
                    {tweet.retweet ? <><Tweet tweet={tweet.retweet} setResendQuery={props.setResendQuery} /> <br /></>:<></>}
                    <span onClick={e => handleLike(e)} style={{paddingRight: ".5rem", zIndex: "999"}}>
                        <Button style={{zIndex: "99999"}} >
                            ❤ <Badge variant="light">{tweet.likes.length}</Badge>
                        </Button>
                    </span>
                    <span onClick={e => handleRetweet(e)} style={{paddingRight: ".5rem", zIndex: "999"}}>
                        <Button style={{zIndex: "99999"}}>
                            <ArrowRepeat size={22}/> <Badge variant="light">{tweet.retweets}</Badge>
                        </Button>
                    </span>
                </Card.Body>
            </Card>
            {tweet.replies && tweet.replies.length > 0  && 
                <div style={{paddingLeft: "3rem", paddingTop: "1rem"}}>
                    <TweetsAndRetweets tweets={tweet.replies} setResendQuery={props.setResendQuery} />
                </div>                                     
            }
            <RetweetModal show={showModal} onHide={() => setShowModal(false)} tweet={tweet} setShowModal={setShowModal} setResendQuery={props.setResendQuery}/>
        </>
    )
}