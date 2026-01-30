import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Usercontext } from '../../App'
import Models from '../Models.jsx'
import ProfileAvatar from './ProfileAvatar'
import DesktopDropdownProfile from './DesktopDropdownProfile'
import DesktopSettingDropdown from './DesktopSettingDropdown'
import DesktopNavLinks from './DesktopNavLinks'
import MobileNavLinks from './MobileNavLinks'

export default function Navbar() {

  // const { logUser, setLogUser } = useContext(Usercontext)
  const userctx = useContext(Usercontext)
  if (!userctx) return null
  const { logUser, setLogUser, selectedUser, setSelectedUser } = userctx

  const navigate = useNavigate()
  const token = localStorage.getItem("loggedToken");

  const [isLogout, setIsLogout] = useState(false)

  const handleLogoutConfirm = () => {
    localStorage.removeItem('loggedToken');
    localStorage.removeItem('demoSessionId')
    setLogUser(null);
    setIsLogout(false);
    navigate('/login');
  };

  const dropdownRef = useRef()

  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfilePanel(PROFILE_STATE.NONE)
      }
    })
  }, [])

  const PROFILE_STATE = {
    NONE: "none",
    DROPDOWN: "dropdown",
    SETTINGS: "settings",
  }

  const [profilePanel, setProfilePanel] = useState(PROFILE_STATE.NONE)


  return (

    <>
      <nav className={`relative bg-white/50 backdrop-blur-lg text-white border-b border-slate-100 shadow-sm grid grid-cols-12 gap-2 py-2 md:py-4`} >

        {/* Brand Logo */}
        < div className="col-span-4 lg:col-span-3 px-4 flex justify-start items-center" >
          <img src="/connectlyLogo.png" className='w-25 h-auto' alt="logo" />
        </div >


        <div className="col-span-8 lg:col-span-9 flex justify-end items-center gap-8 px-6">

          <DesktopNavLinks />
          <MobileNavLinks />

          {/* RIGHT GROUP: Avatar + Dropdown */}
          {token && (
            <div
              ref={dropdownRef}
              className="relative flex items-center">
              <ProfileAvatar panel={{ profilePanel, setProfilePanel }} PROFILE_STATE={PROFILE_STATE} />
              {profilePanel !== PROFILE_STATE.NONE &&

                (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border z-50">

                    {/* Fixed Part ---> Login User Details.  */}
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-semibold text-slate-800">{logUser?.username}</p>
                      <p className="text-xs text-slate-400 truncate">{logUser?.email}</p>
                    </div>

                    {/* Changing Part  */}
                    {
                      profilePanel === PROFILE_STATE.DROPDOWN &&
                      (<DesktopDropdownProfile setProfilePanel={setProfilePanel} PROFILE_STATE={PROFILE_STATE} />)
                    }

                    {
                      profilePanel === PROFILE_STATE.SETTINGS &&
                      (<DesktopSettingDropdown setProfilePanel={setProfilePanel} PROFILE_STATE={PROFILE_STATE} />)
                    }

                    {/* Fixed Part ---> Logout button */}
                    <button
                      onClick={() => { setIsLogout(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <i className="fa-solid fa-power-off text-red-400"></i>
                      Logout
                    </button>

                  </div>
                )

              }

            </div>

          )}

        </div>

      </nav >
      <Models
        isOpen={isLogout}
        onClose={() => setIsLogout(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  )
}


