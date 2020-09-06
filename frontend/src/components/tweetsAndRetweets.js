import React from 'react';
import Tweet from './tweet';
import Retweet from './retweet';

export default function TweetsAndRetweets(props) {
    let { tweets, retweets } = props;
    let tweetsAndRetweets = tweets.concat(retweets);
    tweetsAndRetweets.sort((a, b) => (a.created < b.created) ? 1 : ((b.created < a.created) ? -1 : 0));

    return (
        <>
            {tweetsAndRetweets.map(item => {
                return (item.__typename === "TweetType") ? 
                <div style={{paddingBottom: "1rem"}} key={item.id}><Tweet tweet={item} setResendQuery={props.setResendQuery} /></div> : 
                <div style={{paddingBottom: "1rem"}} key={item.id}><Retweet retweet={item} setResendQuery={props.setResendQuery} /></div>
            })}
        </>
    )
}