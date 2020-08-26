import { gql } from '@apollo/client'

export const PROFILE = gql`
query GetProfile($profile: String!) {
    profile(profile: $profile) {
      id
      user {
        id
        username
      }
      following {
        id
        user {
          id
          username
        }
      }
      followers {
        id
        user {
          id
          username
        }
      }
      created
    }
  }
`