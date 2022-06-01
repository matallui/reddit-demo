import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

interface Props {
  seed?: string
  large?: boolean
}

const Avatar: React.FC<Props> = ({ seed, large }) => {
  const { data: session } = useSession()

  return (
    <div
      className={`relative h-10 w-10 rounded-full border-gray-300 bg-white
      overflow-hidden ${large && 'h-20 w-20'}`}
    >
      <Image
        src={`https://avatars.dicebear.com/api/open-peeps/${
          seed || session?.user?.name || 'placeholder'
        }.svg`}
        layout="fill"
      />
    </div>
  )
}

export default Avatar
