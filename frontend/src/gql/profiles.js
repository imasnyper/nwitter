import { gql } from '@apollo/client'

export const PROFILE = gql`
query GetProfile($id: ID!) {
  profile(id: $id) {
    id
    user {
      username
    }
    followers {
      edges {
        node {
          user {
            username
          }
        }
      }
    }
    following {
      edges {
        node {
          user {
            username
          }
        }
      }
    }
    created
  }
}
`