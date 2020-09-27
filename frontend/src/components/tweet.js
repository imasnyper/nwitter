import { useMutation } from '@apollo/client';
import moment from 'moment';
import React, { useState } from 'react';
import { ArrowRepeat, ReplyFill } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { LIKE_TWEET_MUTATION } from '../gql/tweets';
import ErrorToast from './errorToast';
import RetweetModal from './retweetModal';
import ReplyModal from './replyModal';
import { useHistory } from 'react-router-dom';
import TweetList from './tweetList';
import "./styles/tweet.css";

export default function Tweet(props) {
    const { tweet, setResendQuery, topLevel } = props
    const [showError, setshowError] = useState(false);
    const [showRetweetModal, setShowRetweetModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [hover, setHover] = useState(false);

    const history = useHistory();

    const [ likeTweet, {error: tweetError} ] = useMutation(LIKE_TWEET_MUTATION, {onError: () => {setshowError(true)}})
    
    const handleLike = e => {
        e.stopPropagation();
        e.preventDefault();
        likeTweet({variables: {id: tweet.id}})
        setResendQuery(true);
    }

    const handleRetweet = e => {
        e.stopPropagation();
        e.preventDefault();
        setShowRetweetModal(true);
    }
    
    const handleReply = e => {
        e.stopPropagation();
        e.preventDefault();
        setShowReplyModal(true);
    }

    return (
        <>
            <ErrorToast show={showError} setShow={setshowError} error={tweetError}/>
            <Card 
                className="tweet-card"
                style={hover ? {cursor: "pointer", backgroundColor: "rgb(190, 234, 248)"} : {cursor: "pointer", backgroundColor: "white"}}
                onMouseOver={e => {
                    e.stopPropagation();
                    setHover(true);
                }}
                onMouseOut={e => {
                    e.stopPropagation();
                    setHover(false);
                }}
            >
                <Card.Body>
                    {tweet.isReply                      ? 
                        <Card.Text>in response to&nbsp;
                            <Link 
                                onClick={e => e.stopPropagation()} 
                                to={`/tweet/${tweet.replyTo.id}`}
                            >
                                {`${tweet.replyTo.profile.user.username}'s tweet`}
                            </Link>
                        </Card.Text>                    :
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
                    {tweet.retweet && <Link className="retweet-link" to={`/tweet/${tweet.retweet.id}`}><Tweet tweet={tweet.retweet} setResendQuery={props.setResendQuery} /> <br /></Link>}
                    <span onClick={e => handleLike(e)} style={{paddingRight: ".5rem", zIndex: "999"}}>
                        <Button style={{zIndex: "99999"}} >
                            ❤ <Badge variant="light">{tweet.likes.length}</Badge>
                        </Button>
                    </span>
                    <span onMouseDown={e => e.stopPropagation()} onClick={e => handleRetweet(e)} style={{paddingRight: ".5rem", zIndex: "999"}}>
                        <Button style={{zIndex: "99999"}}>
                            <ArrowRepeat size={22}/> <Badge variant="light">{tweet.retweets}</Badge>
                        </Button>
                    </span>
                    <span onMouseDown={e => e.stopPropagation() } onClick={e => handleReply(e)}>
                        <Button>
                            <ReplyFill size={22} /><Badge variant="light">{tweet.replies && tweet.replies.length}</Badge>
                        </Button>
                    </span>
                </Card.Body>
            </Card>
            {tweet.replies && topLevel && tweet.replies.length > 0  && // only show replies if topLevel prop is set and true, and if there are replies for given tweet.
                <div className="left-pad-lg top-pad-sm">
                    <TweetList tweets={tweet.replies} setResendQuery={props.setResendQuery} />
                </div>                                     
            }
            <RetweetModal onClick={e => e.stopPropagation() } show={showRetweetModal} onHide={() => setShowRetweetModal(false)} tweet={tweet} setShowModal={setShowRetweetModal} setResendQuery={props.setResendQuery}/>
            <ReplyModal onClick={e=> e.stopPropagation() } show={showReplyModal} onHide={() => setShowReplyModal(false)} tweet={tweet} setShowModal={setShowReplyModal} setResendQuery={props.setResendQuery}/>
        </>
    )
}