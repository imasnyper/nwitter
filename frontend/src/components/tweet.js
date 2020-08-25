import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function Tweet(props) {
    const {tweet} = props

    const handleClick = event => {
        props.setViewedProfileID(tweet.profile.id)
    }

    return (
        <Card className="tweet-card">
            <Card.Body>
                <Card.Title><Link onClick={handleClick} to={`/profiles/${tweet.profile.user.username}`}>{tweet.profile.user.username}</Link></Card.Title>
                <Card.Text>{tweet.text}</Card.Text>
            </Card.Body>
        </Card>
    )
}