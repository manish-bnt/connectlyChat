import React from 'react'

export default function ContactName({ friend }) {
  return (
    <p className='text-lg font-semibold text-slate-800'>{friend?.name}</p>
  )
}
