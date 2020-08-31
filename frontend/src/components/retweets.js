import React from 'react';
import Retweet from './retweet';

export default function Retweets(props) {
    const { retweets } = props

    return (
        <>
            {retweets.map(retweet => {
                return <div style={{paddingBottom: "1rem"}} key={retweet.id}><Retweet retweet={retweet} /></div>
            })}
        </>
    )
}