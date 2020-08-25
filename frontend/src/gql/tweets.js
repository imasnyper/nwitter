import { gql } from '@apollo/client'

export const ALL_TWEETS = gql`
query AllTweets {
  allTweets(orderBy: "-created") {
    edges {
      node {
        id
        text
        profile {
          user {
            username
          }
        }
        created
      }
    }
  }
}
`

export const ALL_FOLLOWED_TWEETS = gql`
query AllFollowedTweets {
  allFollowedTweets(orderBy: "-created") {
    edges {
      node {
        id
        text
        profile {
          id
          user {
            id
            username
          }
        }
        likes
      }
    }
  }
}
`

export const PROFILE_TWEETS = gql`
query ProfileTweets($profile: ID!) {
  profileTweets(profile: $profile, orderBy: "-created") {
    edges {
      node {
        id
        text
        profile {
          id
          user {
            id
            username
          }
        }
      }
    }
  }
}
`

export const COMPOSE_TWEET_MUTATION = gql`
mutation CreateTweet($text: String!) {
  createTweet(text: $text) {
    tweet {
      id 
      text
      profile {
        id
        user {
          id
          username
        }
      }
    }
  }
}
`