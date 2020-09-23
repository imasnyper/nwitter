import { useQuery } from '@apollo/client';
import React, { useEffect, useState, useRef } from 'react';
import { ALL_FOLLOWED_TWEETS } from '../gql/tweets';
import TweetsAndRetweets from './tweetsAndRetweets';
import { useTraceUpdate } from '../lib/helperFunctions'


export default function FollowedTweets(props) {
    // useTraceUpdate(props)
    const { data, loading, error, refetch, fetchMore } = useQuery(
        ALL_FOLLOWED_TWEETS,
        {
            // pollInterval: 1000 * 2,
        }    
    )
    const [after, setAfter] = useState(0);

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
        console.log("load more called")
        fetchMore({
            variables: {
                after: after + 5
            },
            // TODO: implement https://github.com/apollographql/apollo-client/issues/6502
            updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult || (fetchMoreResult.allFollowedTweets.length === 0)) {
                    return prev;
                }
                if (!prev.allFollowedTweets) {
                    return
                }
                setAfter(after + 5)
                return Object.assign({}, prev, {
                    allFollowedTweets: [...prev.allFollowedTweets, ...fetchMoreResult.allFollowedTweets],
                });
            }
        })
    }
    
    useEffect(() => {
        console.log("because of resendQuery")
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
    if(error) {console.log(error); return <p>Error <span role="img" aria-label="crying">😭</span></p>}

    const tweets = data.allFollowedTweets

    return <TweetsAndRetweets tweets={tweets} setResendQuery={props.setResendQuery} />
}