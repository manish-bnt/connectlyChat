import React, { useContext } from 'react'
import { Usercontext } from '../../App'
import { properCase } from '../../utility/utility'
import Spinner from '../Spinner'

export default function ProfileAvatar({ panel, PROFILE_STATE }) {
  const { logUser } = useContext(Usercontext)
  if (!Usercontext) return <Spinner />
  return (
    <>
      {/* Avatar Button */}
      <button
        onClick={() =>
          panel.setProfilePanel(
            panel.profilePanel === PROFILE_STATE.DROPDOWN ?
              PROFILE_STATE.NONE : PROFILE_STATE.DROPDOWN
          )
        }
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition-all active:scale-95 border border-slate-200"
      >
        <div className="size-9 bg-emerald-500 text-white rounded-full object-contain flex items-center justify-center font-bold shadow-sm">
          {
            !logUser?.profile ?
              <p className='font-bold text-md'>{properCase(logUser?.username[0])}</p>
              :
              <img className='w-full h-full rounded-full' src={logUser?.profile?.url} alt="profile-img" />
            // <img className='w-full h-full rounded-full' src={`${import.meta.env.VITE_API_URL}${logUser?.profile}`} alt="profile-img" />
          }
        </div>
        <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform ${panel.profilePanel === PROFILE_STATE.DROPDOWN ? 'rotate-180' : ''}`}></i>
      </button>
    </>
  )
}

