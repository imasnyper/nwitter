import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function Tweet(props) {
    const {tweet} = props

    return (
        <Card className="tweet-card">
            <Card.Body>
                <Card.Title><Link to={`/profiles/${tweet.profile.user.username}`}>{tweet.profile.user.username}</Link></Card.Title>
                <Card.Text>{tweet.text}</Card.Text>
            </Card.Body>
        </Card>
    )
}