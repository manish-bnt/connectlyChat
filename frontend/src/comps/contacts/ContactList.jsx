import React from 'react'
import { properCase } from '../../utility/utility'
import { useContext } from 'react';
import { Usercontext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

// Displays a single contact item in the contact list
export default function ContactList({ c }) {

  // console.log("ccc:", c)
  // console.log(`dfdfdsf  ${import.meta.env.VITE_API_URL}${c.linkedUser.profile}`)
  // const { lastMsg } = useContext(Usercontext)

  return (
    <div className='bg-transparent w-full h-12 px-2 py-8 flex gap-4 items-center shadow-lg cursor-pointer'>
      {/* Avatar section */}
      <div className='w-12 h-12 font-bold bg-emerald-100 text-emerald-900 rounded-full flex justify-center items-center'>
        {
          !c?.linkedUser?.profile ?
            <p className='font-bold text-lg'>{properCase(c.name[0])}</p>
            :
            <img className='w-full h-full rounded-full' src={c.linkedUser.profile.url} alt="profile-img" />
          // <img className='w-full h-full rounded-full' src={`${import.meta.env.VITE_API_URL}${c.linkedUser.profile}`} alt="profile-img" />
        }
      </div>

      {/* info section  */}

      <div className="flex flex-col flex-1">
        <h3 className="text-base font-bold text-slate-800">
          {properCase(c?.name)}
        </h3>

        <div className="flex items-center gap-2 mt-1">

          {/* {<p className='text-sm text-slate-500 w-[25%] max-w-sm truncate'>{lastMsg?.text || "No messages yet"}</p>} */}
          {<p className='text-sm text-slate-500 w-[25%] max-w-sm truncate'><FontAwesomeIcon icon={faPhone} /> {c?.mobile}</p>}

        </div>
      </div>

      {/* Action button  */}

      <div className="text-slate-300 hover:text-emerald-500 cursor-pointer">
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </div>

    </div>
  )
}
