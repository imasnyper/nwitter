import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ALL_FOLLOWED_TWEETS_AND_RETWEETS } from '../gql/tweets';
import TweetsAndRetweets from './tweetsAndRetweets';

export default function FollowedTweets(props) {
    const { data, loading, error, refetch, fetchMore } = useQuery(ALL_FOLLOWED_TWEETS_AND_RETWEETS)
    const [after, setAfter] = useState(0);

    console.log(props.setResendQuery)

    const isBottom = el => {
        if (!el) return
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    const trackScrolling = () => {
        const element = props.containerRef.current
        if(isBottom(element)) {
            console.log('at bottom, loading more')
            loadMore()
        }
    }

    const loadMore = () => {
        setAfter(after + 10)
        fetchMore({
            variables: {
                after: after + 10
            },
            updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult) {
                    setAfter(after - 10)
                    return prev;
                }
                if (!prev.allFollowedTweets || !prev.allFollowedRetweets) {
                    return
                }
                return Object.assign({}, prev, {
                    allFollowedTweets: [...prev.allFollowedTweets, ...fetchMoreResult.allFollowedTweets],
                    allFollowedRetweets: [...prev.allFollowedRetweets, ...fetchMoreResult.allFollowedRetweets]
                });
            }
        })
    }
    
    useEffect(() => {
        if(props.resendQuery) {
            refetch()
            props.setResendQuery(false)
        }
    }, [props, refetch])

    useEffect(() => {
        document.addEventListener('scroll', trackScrolling)
        return () => document.removeEventListener('scroll', trackScrolling)
    })

    if(loading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(error) return <p>Error <span role="img" aria-label="crying">😭</span></p>

    const tweets = data.allFollowedTweets
    const retweets = data.allFollowedRetweets

    return <TweetsAndRetweets tweets={tweets} retweets={retweets} setResendQuery={props.setResendQuery} />
}