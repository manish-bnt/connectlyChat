import React from 'react'

export default function ContactCard({ contact }) {
  // console.log("chihld redndered 2")
  return (

    <>
      {/*Contact Card UI */}
      < div className='w-full max-w-sm mx-auto shadow-2xl bg-white rounded-2xl overflow-hidden border-t-8 border-emerald-500 transition-all duration-300' >

        <div className='p-6'>
          {/* Top Header: Avatar + Name Section */}
          <div className='flex items-center gap-4 border-b border-slate-200 pb-4'>
            {/* Avatar Circle */}
            <div className='w-16 h-16 bg-emerald-500 flex justify-center items-center rounded-full shadow-lg'>
              <i className="fa-solid fa-user text-white text-3xl"></i>
            </div>

            <div className='flex-1 overflow-hidden'>
              <h3 className='text-xl font-bold text-slate-800 truncate'>
                {contact.name || "Full Name"}
              </h3>
              <p className='text-emerald-600 text-sm font-medium'>Personal Contact</p>
            </div>
          </div>

          {/* Details Section: Icons + Text */}
          <div className='mt-5 space-y-4'>

            {/* Email Row */}
            <div className='flex items-center gap-3 text-slate-600'>
              <div className='w-8 h-8 bg-emerald-50 flex items-center justify-center rounded-full'>
                <i className="fa-solid fa-envelope text-emerald-500 text-sm"></i>
              </div>
              <span className='text-sm truncate'>{contact.email || "example@gmail.com"}</span>
            </div>

            {/* Mobile Row */}
            <div className='flex items-center gap-3 text-slate-600'>
              <div className='w-8 h-8 bg-emerald-50 flex items-center justify-center rounded-full'>
                <i className="fa-solid fa-phone text-emerald-500 text-sm"></i>
              </div>
              <span className='text-sm font-semibold'>{contact.mobile || "+91 00000-00000"}</span>
            </div>

            {/* Address Row */}
            <div className='flex items-start gap-3 text-slate-600'>
              <div className='w-8 h-8 bg-emerald-50 flex items-center justify-center rounded-full shrink-0'>
                <i className="fa-solid fa-location-dot text-emerald-500 text-sm"></i>
              </div>
              <span className='text-sm leading-relaxed'>
                {contact.address || "Street Name, City, Country"}
              </span>
            </div>

          </div>
        </div>
      </div >
    </>

  )
}
