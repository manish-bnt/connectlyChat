import React from 'react'

export default function ContactEmail({ friend }) {
  return (
    <p className='text-md text-slate-600'>{friend?.email}</p>
  )
}
