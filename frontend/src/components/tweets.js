import React from 'react'
import Tweet from './tweet'

export default function Tweets(props) {
    const { tweets } = props

    return (
        <ul>
            {tweets.map(tweet => {
                return <li key={tweet.id}><Tweet tweet={tweet} /></li>
            })}
        </ul>
    )
}