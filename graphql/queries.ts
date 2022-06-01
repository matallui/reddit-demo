import { gql } from '@apollo/client'

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

export const GET_SUBREDDIT = gql`
  query MyQuery {
    getSubredditList {
      id
      topic
      created_at
    }
  }
`
