import React, {useState} from 'react';
import { useMutation } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import { LIKE_TWEET_MUTATION } from '../gql/tweets';
import ErrorToast from './errorToast';
import { ArrowRepeat } from 'react-bootstrap-icons';

export default function Tweet(props) {
    const { tweet } = props
    const [show, setShow] = useState(false);

    const [ likeTweet, {error} ] = useMutation(LIKE_TWEET_MUTATION, {onError: () => {setShow(true)}})
    
    const handleLike = () => {
        likeTweet({variables: {id: tweet.id}})
        props.setResendQuery(true);
    }

    return (
        <>
            <ErrorToast show={show} setShow={setShow} error={error}/>
            <Card className="tweet-card">
                <Card.Body>
                    <Card.Title>
                        <Link to={`/profiles/${tweet.profile.user.username}`}>{tweet.profile.user.username}</Link>
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
                        <Button>
                            <ArrowRepeat size={22}/> <Badge variant="light">{tweet.retweets.length}</Badge>
                        </Button>
                    </span>
                </Card.Body>
            </Card>
        </>
    )
}