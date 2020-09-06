import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LIKE_TWEET_MUTATION } from '../gql/tweets'
import ErrorToast from './errorToast';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { ArrowRepeat } from 'react-bootstrap-icons';
import Tweet from './tweet';
import moment from 'moment';
import RetweetModal from './retweetModal';


export default function Retweet(props) {
    const { retweet } = props
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [ likeTweet, {error} ] = useMutation(LIKE_TWEET_MUTATION, {onError: () => setShow(true)})

    const handleLike = () => {
        likeTweet({variables: {id: retweet.id}})
        props.setResendQuery(true);
    }
    
    return (
        <>
            <ErrorToast show={show} setShow={setShow} error={error}/>
            <Card className="tweet-card">
                <Card.Body>
                    <Card.Title>
                        <span><Link to={`/profiles/${retweet.profile.user.username}`}>{retweet.profile.user.username}</Link></span>
                        <span style={{fontStyle: "normal", fontSize: ".75rem"}}>&nbsp;-&nbsp;tweeted {moment(retweet.created).fromNow()}</span>
                    </Card.Title>
                    <Card.Text>
                        {retweet.text}
                    </Card.Text>
                    <div style={{paddingBottom: "1rem"}}>
                        <Tweet setResendQuery={props.setResendQuery} tweet={retweet.tweet} />
                    </div>
                    <span style={{paddingRight: ".5rem"}}>
                        <Button onClick={handleLike}>
                            ❤ <Badge variant="light">{retweet.likes.length}</Badge>
                        </Button>
                    </span>
                    <span>
                        <Button onClick={() => setShowModal(true)}>
                            <ArrowRepeat size={22}/> <Badge variant="light">{retweet.retweets.length}</Badge>
                        </Button>
                    </span>
                </Card.Body>
            </Card>
            <RetweetModal show={showModal} onHide={() => setShowModal(false)} tweet={retweet} setShowModal={setShowModal} setResendQuery={props.setResendQuery}/>
        </>
    )
}