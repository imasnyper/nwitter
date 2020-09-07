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
import Tweet from './tweet';
import { useHistory } from 'react-router-dom';


export default function Retweet(props) {
    const { retweet } = props
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    const [ likeTweet, {error} ] = useMutation(LIKE_TWEET_MUTATION, {onError: () => setShow(true)})

    const handleLike = () => {
        likeTweet({variables: {id: retweet.id}})
        props.setResendQuery(true);
    }
    
    return (
        <>
            <ErrorToast show={show} setShow={setShow} error={error}/>
            <Card onClick={() => history.push(`/retweet/${retweet.id}`)} style={{cursor: "pointer"}} className="tweet-card">
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
                    <span onClick={e => {e.stopPropagation(); handleLike()}} style={{paddingRight: ".5rem"}}>
                        <Button >
                            ❤ <Badge variant="light">{retweet.likes.length}</Badge>
                        </Button>
                    </span>
                    <span onClick={(e) => {e.stopPropagation(); setShowModal(true)}}>
                        <Button>
                            <ArrowRepeat size={22}/> <Badge variant="light">{retweet.retweets.length}</Badge>
                        </Button>
                    </span>
                </Card.Body>
            </Card>
            <RetweetModal show={showModal} onHide={() => setShowModal(false)} tweet={retweet} setShowModal={setShowModal} setResendQuery={props.setResendQuery}/>
        </>
    )
}