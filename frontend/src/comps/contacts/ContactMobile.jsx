import React from 'react'

export default function ContactMobile({ friend }) {
  return (
    <p className='text-md text-slate-600'>{friend?.mobile}</p>
  )
}
