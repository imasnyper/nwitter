import React from 'react';
import Tweet from './tweet';
import Retweet from './retweet';

export default function TweetsAndRetweets(props) {
    let { tweets } = props;

    return (
        <>
            {tweets.map(item => {
                return <div style={{paddingBottom: "1rem"}} key={item.id}><Tweet tweet={item} setResendQuery={props.setResendQuery} /></div>
            })}
        </>
    )
}