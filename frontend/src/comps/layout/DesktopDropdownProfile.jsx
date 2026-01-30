import React from 'react'
import { Link } from 'react-router-dom'

export default function DesktopDropdownProfile({ setProfilePanel, PROFILE_STATE }) {
  return (
    <>
      {/* Dropdown Menu */}

      <Link to="/my-profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
        <i className="fa-solid fa-user-circle text-slate-400"></i>
        My Profile
      </Link>

      <div className='md:hidden'>
        <Link className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors' to="/contacts">
          <i className="fa-solid fa-address-book text-slate-400"></i>
          Chats
        </Link>

        <Link className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors' to="/add-contact">
          <i className="fa-solid fa-user-plus text-slate-400"></i>
          Add Contact
        </Link>
      </div>

      <button
        onClick={() => setProfilePanel(PROFILE_STATE.SETTINGS)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
        <i className="fa-solid fa-gear text-slate-400"></i>
        Account Settings
      </button>


      <div className="h-[1px] bg-slate-100 my-1"></div>


    </>
  )
}
