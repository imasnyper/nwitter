import { gql } from '@apollo/client'
import { loader } from 'graphql.macro'

// const profileDetailFragment = loader('./fragments/profileDetailFragment.graphql')
const likeFragment = loader('./fragments/likeFragment.graphql')
const retweetDetailFragment = loader('./fragments/retweetDetailFragment.graphql')
const tweetDetailFragment = loader('./fragments/tweetDetailFragment.graphql')

export const ALL_TWEETS = gql`
query AllTweets {
  allTweets { 
    ...TweetDetailFragment
  }
}
${tweetDetailFragment}
`

export const ALL_FOLLOWED_TWEETS = gql`
query AllFollowedTweets {
  allFollowedTweets {
    ...TweetDetailFragment 
  } 
}
${tweetDetailFragment}
`

export const PROFILE_TWEETS = gql`
query ProfileTweets($profile: String!, $first: Int, $after: Int) {
  profileTweets(profile: $profile, first: $first, after: $after) {
    ...TweetDetailFragment
  }
  profileRetweets(profile: $profile, first: $first, after: $after) {
    ...RetweetDetailFragment
  }
}
${tweetDetailFragment}
${retweetDetailFragment}
`

export const ALL_FOLLOWED_TWEETS_AND_RETWEETS = gql`
query AllFollowedTweetsAndRetweets($first: Int, $after: Int) {
  allFollowedTweets(first: $first, after: $after) {
    ...TweetDetailFragment
  }
  allFollowedRetweets(first: $first, after: $after) {
    ...RetweetDetailFragment
  }
}
${tweetDetailFragment}
${retweetDetailFragment}
`

export const GET_TWEET = gql`
query getTweet($id: Int!) {
  getTweet(id: $id) {
    ...TweetDetailFragment
  }
}
${tweetDetailFragment}
`

export const GET_RETWEET = gql`
query getRetweet($id: Int!) {
  getRetweet(id: $id) {
    ...RetweetDetailFragment
  }
}
${retweetDetailFragment}
`

export const COMPOSE_TWEET_MUTATION = gql`
mutation CreateTweet($text: String!) {
  createTweet(text: $text) {
    tweet {
      ...TweetDetailFragment
    }
  }
}
${tweetDetailFragment}
`

export const LIKE_TWEET_MUTATION = gql`
mutation LikeTweet($id: Int!) {
  likeTweet(id: $id) {
    tweet {
      ...TweetDetailFragment
    }
  }
}
${tweetDetailFragment}
`

export const RETWEET_TWEET_MUTATION = gql`
mutation RetweetTweet($id: Int!, $text: String) {
  retweetTweet(id: $id, text: $text) {
    tweet {
      ...TweetDetailFragment
    }
  }
}
${tweetDetailFragment}
`