import React from 'react';
import Tweet from './tweet';
import { Link } from 'react-router-dom';
import "./styles/tweetList.css";

export default function TweetList(props) {
    const { tweets, topLevel } = props
    
    return (
        <>
            {tweets.map(item => {
                return <Link to={`/tweet/${item.id}`} className="tweet-link bot-marg-sm" key={item.id}><Tweet topLevel={topLevel} tweet={item} setResendQuery={props.setResendQuery} /></Link>
            })}
        </>
    )
}