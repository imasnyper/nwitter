import React from 'react';
import Tweets from './tweets';
import Retweets from './retweets'

export default function TweetsAndRetweets(props) {
    const { tweets, retweets } = props

    return (
        <>
            <Tweets tweets={tweets} />
            <Retweets retweets={retweets} />
        </>
    )
}