import React from 'react'

export default function Tweet(props) {
    const {tweet} = props

    return (
        <div className="tweet-card">
            <h2>{tweet.profile.user.username}</h2>
            <p>{tweet.text}</p>
        </div>
    )
}