import React from 'react';
import Tweet from './tweet';

export default function Tweets(props) {
    const { tweets } = props

    return (
        <>
            {tweets.map(tweet => {
                return <div style={{paddingBottom: "1rem"}} key={tweet.id}><Tweet setResendQuery={props.setResendQuery} tweet={tweet} /></div>
            })}
        </>
    )
}