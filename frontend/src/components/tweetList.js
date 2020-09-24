import React from 'react';
import Tweet from './tweet';

export default function TweetList(props) {
    const { tweets } = props
    
    return (
        <>
            {tweets.map(item => {
                return <div style={{paddingBottom: "1rem"}} key={item.id}><Tweet tweet={item} setResendQuery={props.setResendQuery} /></div>
            })}
        </>
    )
}