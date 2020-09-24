import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ALL_FOLLOWED_TWEETS, ALL_TWEETS } from '../gql/tweets';
import TweetList from './tweetList';


export default function Tweets(props) {
    const tweetQuery = props.followedTweetsOnly ? ALL_FOLLOWED_TWEETS : ALL_TWEETS
    const { data, loading, error, refetch, fetchMore } = useQuery(
        tweetQuery,
        {
            // pollInterval: 1000 * 2,
        }    
    )
    const [afterAll, setAfterAll] = useState(0);
    const [afterFollowed, setAfterFollowed] = useState(0);


    const isBottom = el => {
        if (!el) return
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    const trackScrolling = () => {
        const element = props.containerRef.current
        if(isBottom(element)) {
            props.followedTweetsOnly ? loadMore("allFollowedTweets") : loadMore("allTweets")
        }
    }

    const loadMore = queryResultName => {
        fetchMore({
            variables: {
                after: props.followedTweetsOnly ? afterFollowed + 5 : afterAll + 5
            },
            // TODO: implement https://github.com/apollographql/apollo-client/issues/6502
            updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult || (fetchMoreResult[queryResultName].length === 0)) {
                    return prev;
                }
                if (!prev[queryResultName]) {
                    return
                }
                props.followedTweetsOnly ? setAfterFollowed(afterFollowed + 5) : setAfterAll(afterAll + 5);
                return Object.assign({}, prev, {
                    [queryResultName]: [...prev[queryResultName], ...fetchMoreResult[queryResultName]],
                });
            }
        })
    }
    
    //refetch results
    useEffect(() => {
        if(props.resendQuery) {
            refetch()
            props.setResendQuery(false)
        }
    }, [props, refetch])

    //loads more tweets if the 5 loaded isn't enough to fill the window and create a scroll bar
    useEffect(() => {
        const element = props.containerRef.current
        if(isBottom(element)) {
            props.followedTweetsOnly ? loadMore("allFollowedTweets") : loadMore("allTweets")
        }
    }, [props.followedTweetsOnly])

    //add scroll event listener
    useEffect(() => {
        document.addEventListener('scroll', trackScrolling)
        return () => document.removeEventListener('scroll', trackScrolling)
    })

    if(loading) return <p>Loading... <span role="img" aria-label="hourglass">⌛</span></p>
    if(error) {console.log(error); return <p>Error <span role="img" aria-label="crying">😭</span></p>}

    const tweets = props.followedTweetsOnly ? data.allFollowedTweets : data.allTweets

    return <TweetList setResendQuery={props.setResendQuery} tweets={tweets} />
}