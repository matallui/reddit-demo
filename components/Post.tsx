import React, { useEffect, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from '@heroicons/react/outline'
import TimeAgo from 'react-timeago'
import Avatar from './Avatar'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { GET_ALL_POSTS, GET_VOTES_BY_POST_ID } from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'

interface Props {
  post: Post
}

const Post: React.FC<Props> = ({ post }) => {
  const [vote, setVote] = useState<boolean | undefined>(undefined)
  const [voteCount, setVoteCount] = useState(0)
  const { data: session } = useSession()
  const { data, loading } = useQuery(GET_VOTES_BY_POST_ID, {
    variables: { post_id: post?.id },
  })
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTES_BY_POST_ID, 'getVoteListByPostId'],
  })

  useEffect(() => {
    const votes: Vote[] = data?.getVoteListByPostId

    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote

    const voteCount = votes?.reduce((prev, curr) => {
      if (curr.upvote) {
        return prev + 1
      } else {
        return prev - 1
      }
    }, 0)

    if (!votes || votes.length === 0) {
      setVoteCount(0)
    } else if (voteCount === 0) {
      setVoteCount(votes[0]?.upvote ? 1 : -1)
    } else {
      setVoteCount(voteCount)
    }

    setVote(vote)
  }, [data])

  const upvote = async (isUpvote: boolean) => {
    if (!session) {
      toast("You'll need to sign in to vote.")
      return
    }
    if (vote && isUpvote) return
    if (vote === false && !isUpvote) return
    await addVote({
      variables: {
        post_id: post.id,
        username: session.user?.name,
        upvote: isUpvote,
      },
    })
  }

  if (!post) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#ff4501" />
      </div>
    )
  }

  return (
    <Link href={`/post/${post.id}`}>
      <div
        className="flex cursor-pointer rounded-md border border-gray-300
    bg-white shadow-sm hover:border hover:border-gray-600 my-2"
      >
        <div
          className="flex flex-col items-center justify-start space-y-1
        rounded-l-md bg-gray-50 p-4 text-gray-400"
        >
          <ArrowUpIcon
            onClick={() => upvote(true)}
            className={`vote-btn hover:text-blue-400 ${
              vote && 'text-blue-400'
            }`}
          />
          <p className={`text-black font-bold text-xs`}>{voteCount}</p>
          <ArrowDownIcon
            onClick={() => upvote(false)}
            className={`vote-btn hover:text-red-400 ${
              vote === false && 'text-red-400'
            }`}
          />
        </div>

        <div className="p-2 pb-1">
          <header className="flex items-center space-x-2">
            <Avatar seed={post.subreddit.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit.topic}
                </span>
              </Link>{' '}
              • Posted by u/{post.username} <TimeAgo date={post.created_at} />
            </p>
          </header>
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>

          {post.image && <img src={post.image} alt="post image" />}

          <footer className="flex space-x-4 text-gray-400">
            <div className="post-btn">
              <ChatAltIcon className="h-6 w-6" />
              <p className="">{post.comments.length} Comments</p>
            </div>
            <div className="post-btn">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="post-btn">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="post-btn">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="post-btn">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </footer>
        </div>
      </div>
    </Link>
  )
}

export default Post
