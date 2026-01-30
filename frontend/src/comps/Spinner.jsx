import React from 'react'

export default function Spinner() {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='w-16 h-16 mx-auto rounded-full'>
        <div className="animate-spin w-full h-full rounded-full border-8 border-slate-200 border-t-emerald-500"></div>
      </div>
    </div>
  )
}
