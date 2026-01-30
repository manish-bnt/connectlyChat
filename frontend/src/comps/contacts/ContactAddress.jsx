import React from 'react'

export default function ContactAddress({ friend }) {
  return (
    <p className='text-md text-slate-600'>{friend?.address}</p>
  )
}
