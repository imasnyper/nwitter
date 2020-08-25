import React from 'react';
import Tweet from './tweet';
import ListGroup from 'react-bootstrap/ListGroup';

export default function Tweets(props) {
    const { tweets } = props

    return (
        <>
            {tweets.map(tweet => {
                return (
                    <div style={{paddingBottom: "1rem"}} key={tweet.node.id}>
                        <Tweet 
                            tweet={tweet.node} 
                            setViewedProfileID={props.setViewedProfileID}
                        />
                    </div>
                )
            })}
        </>
    )
}