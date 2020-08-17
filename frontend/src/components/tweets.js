import React from 'react'
import Tweet from './tweet'

export default function Tweets(props) {
    const {allFollowedTweets} = props

    return (
        <ul>
            {allFollowedTweets.map(tweet => {
                return <li><Tweet tweet={tweet} /></li>
            })}
        </ul>
    )
}