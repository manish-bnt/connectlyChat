import React from 'react'
import { properCase } from '../../utility/utility'

export default function ChatHeader({ friend }) {
  return (
    <>
      {/* Chat Header Container  */}
      <div className='w-full flex items-center gap-2 py-2 md:py-4 px-2 sticky top-0'>

        {/* Avatar Section  */}
        {
          !friend?.linkedUser?.profile ?
            (
              <div className='w-10 bg-emerald-500 text-white h-10 font-bold rounded-full text-center content-center shadow-lg'>{properCase(friend?.name[0])}</div>
            )
            :
            // Show profile image if available
            (
              <img className='w-10 h-10 rounded-full object-cover' src={friend.linkedUser.profile.url} alt="profile-img" />
              // <img className='w-10 h-10 rounded-full object-cover' src={`${import.meta.env.VITE_API_URL}${friend.linkedUser.profile}`} alt="profile-img" />
            )
        }
        {/* Contact Name */}
        <h2 className='text-black'>
          {friend?.name}
        </h2>
      </div>
    </>
  )
}











