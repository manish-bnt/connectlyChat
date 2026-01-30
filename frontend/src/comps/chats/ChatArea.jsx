import React, { useContext, useEffect, useRef } from 'react'
import { Usercontext } from '../../App';
import { formatTime } from '../../utility/utility';
import Spinner from '../Spinner';
import { useState } from 'react';

export default function ChatArea({ messages }) {
  const { logUser } = useContext(Usercontext)
  const scrollRef = useRef(null);
  
  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); // smooth scroll to last message
  }, [messages])





  return (
    <>
      {/* Chat Area Container */}
      <div className='flex flex-col flex-1 overflow-y-auto px-2'>
        {/* Render all messages */}
        {messages?.map((m) => {
          if (!m || !m.sender) return null;
          // console.log("ms: ", m)
          // Determine if the current message was sent by the logged-in user
          const senderId = typeof m.sender === "object" ? m.sender._id : m.sender;

          const isMe = logUser && String(senderId) === String(logUser._id);

          return (
            <div
              key={m?._id}
              className={`max-w-[70%] p-2 my-2 rounded-lg text-sm shadow-md 
                ${isMe
                  ? "bg-emerald-500 text-white self-end rounded-tr-none" // styling for sender
                  : "bg-white text-slate-800 self-start rounded-tl-none" // styling for receiver
                }`}
            >
              {/* Message text */}
              <p className='break-words'>{m?.text}</p>

              {/* Timestamp */}
              <span className="text-[10px] opacity-70 block text-right mt-1">
                {formatTime(m?.createdAt)}
              </span>
            </div>
          )
        })}

        {/* Dummy div for scrolling to the last message */}
        <div ref={scrollRef} />
      </div>
    </>
  )
}




