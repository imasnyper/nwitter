import { gql } from '@apollo/client'

export const ALL_TWEETS = gql`
query AllTweets {
  allTweets { 
    text
    profile {
      user {
        username
      }
    }
  }
}
`

export const ALL_FOLLOWED_TWEETS = gql`
query AllFollowedTweets {
  allFollowedTweets {
    text
    profile {
      user {
        username
      }
    }
  }
}
`