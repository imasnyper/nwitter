import React from 'react';
import { useMutation } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import { LIKE_TWEET_MUTATION } from '../gql/tweets';

export default function Tweet(props) {
    const { tweet } = props
    const [ likeTweet ] = useMutation(LIKE_TWEET_MUTATION)

    console.log(tweet.likes)

    return (
        <Card className="tweet-card">
            <Card.Body>
                <Card.Title><Link to={`/profiles/${tweet.profile.user.username}`}>{tweet.profile.user.username}</Link></Card.Title>
                <Card.Text>
                    {tweet.text}
                </Card.Text>
                <span><Button onClick={() => likeTweet({variables: {id: tweet.id}})}>❤</Button></span><span>&nbsp;{tweet.likes}</span>
            </Card.Body>
        </Card>
    )
}