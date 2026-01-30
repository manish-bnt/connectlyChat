import React from 'react'
import { properCase } from '../../utility/utility'

export default function ContactProfile({ friend }) {
  if (!friend?.linkedUser) {
    return (
      <p className="text-slate-400 text-sm">
        ?
      </p>
    )
  }
  return (
    <>
      {
        friend.linkedUser.profile ?
          (
            <>
              <img className='h-full w-full' src={friend?.linkedUser?.profile?.url} alt="friend-profile" />
              {/* <img className='h-full w-full' src={`${import.meta.env.VITE_API_URL}${friend?.linkedUser?.profile}`} alt="friend-profile" /> */}
            </>
          )
          :

          (
            <p className="text-black font-bold text-2xl">
              {properCase(friend.linkedUser.username?.[0] || "?")}
            </p>
          )

      }
    </>
  )
}
