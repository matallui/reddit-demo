import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POSTS, GET_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'

interface Props {
  topic?: string
}

const Feed: React.FC<Props> = ({ topic }) => {
  const { loading, data, error } = topic
    ? useQuery(GET_POSTS_BY_TOPIC, { variables: { topic } })
    : useQuery(GET_ALL_POSTS)

  const posts: Post[] = topic ? data?.getPostListByTopic : data?.getPostList

  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
