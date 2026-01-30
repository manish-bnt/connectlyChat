import React, { useEffect } from 'react'

export default function PopupMsg({ message }) {

  if (!message) return null

  

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">

      <div className={`
        flex items-center justify-center
        p-4 rounded-lg shadow-2xl border-l-8
        bg-white text-gray-800
        ${message.type === "error" ? 'border-red-600' : 'border-emerald-500'}
        animate-bounce-in
        `}>
        <p className='text-sm md:text-base font-medium'>
          {message.text}
        </p>
      </div>

    </div>
  )
}
