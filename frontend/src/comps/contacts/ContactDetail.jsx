import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import ContactProfile from './ContactProfile'
import ContactName from './ContactName'
import ContactMobile from './ContactMobile'
import ContactEmail from './ContactEmail'
import { deleteChatsAPI } from '../api/api'
import PopupMsg from '../PopupMsg'
import ContactAddress from './ContactAddress'
import useAutoClearMessage from '../../customHooks/useAutoClearMessage'

export default function ContactDetail({ friend, setPanel, msg }) {
  const [message, setMessage] = useState(null)
   useAutoClearMessage(message, setMessage, 2000)

  // Clear all messages with this contact
  const clearChats = async (e) => {
    e.preventDefault()

    // Confirm before deleting
    if (!window.confirm("Are you sure you want to clear this chat?")) return;

    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await deleteChatsAPI(token, friend.linkedUser._id)

      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || "Unable to delete chats" })
      }

      // Clear messages in global state
      msg.setMessages([])
      return setMessage({ type: 'success', text: data.msg || 'Chats cleared for you!' })
    } catch (error) {
      console.error(error.message)
      return setMessage({ type: 'error', text: error.message })
    }
  }

  return (
    <>
      {/* Main Container */}
      <div className='w-full h-full flex flex-col gap-4'>

        {/* Popup messages for success/error */}
        <PopupMsg message={message} />

        {/* Top Header */}
        <div className='py-2 mt-2 flex justify-between'>
          {/* Close panel button */}
          <button onClick={() => setPanel("none")} className='p-2 cursor-pointer'>
            <FontAwesomeIcon className='text-slate-600' icon={faX} />
          </button>

          {/* Header title and edit icon */}
          <div className='flex justify-between items-center flex-1 px-2'>
            <h2 className='text-md'>Contact info</h2>
            <FontAwesomeIcon
              className='text-slate-600 cursor-pointer'
              onClick={() => setPanel("editContact")}
              icon={faPencil}
            />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className='flex flex-col items-center justify-center gap-2'>
          {/* Avatar */}
          <div className='w-20 h-20 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center'>
            <ContactProfile friend={friend} />
          </div>

          {/* Name, Mobile, Email */}
          <ContactName friend={friend} />
          <ContactMobile friend={friend} />
          <ContactEmail friend={friend} />
          <ContactAddress friend={friend} />
        </div>

        {/* Divider */}
        <div className='w-[90%] border border-slate-200 mx-auto'></div>

        {/* Action Buttons */}
        <div className='w-full bg-red-200'>
          <button
            onClick={clearChats}
            className='bg-slate-200 hover:bg-slate-400 transition-all duration-300 cursor-pointer w-full p-4 text-start flex items-center gap-2'
          >
            <FontAwesomeIcon icon={faTrash} className='text-slate-900' />
            Clear chat
          </button>
        </div>
      </div>
    </>
  )
}

