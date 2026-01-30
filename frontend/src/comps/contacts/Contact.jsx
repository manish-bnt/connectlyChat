import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import PopupMsg from '../PopupMsg'
import { useContext } from 'react'
import { Usercontext } from '../../App'
import { properCase } from '../../utility/utility'
import ContactList from './ContactList'
import ChatWindow from '../chats/ChatWindow'
import ContactDetail from './ContactDetail'
import useAutoClearMessage from '../../customHooks/useAutoClearMessage'

export default function Contact() {
  const { logUser, contacts, selectedUser, setSelectedUser } = useContext(Usercontext)
  const location = useLocation()
  const [localMsg, setLocalMsg] = useState(null)
  // const [selectedUser, setSelectedUser] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  // console.log("contacts:new ", contacts)

  // Read message ONCE
  useEffect(() => {
    if (location.state?.success) {
      setLocalMsg({ type: 'success', text: location.state?.success })

      // clear router state immediately
      navigate(location.pathname, { replace: true })
    }
  }, [])

  // Auto clear message

  useAutoClearMessage(localMsg, setLocalMsg, 2000)




  useEffect(() => {
    if (!id || contacts.length === 0) return;

    const found = contacts.find(c => c.linkedUser?._id === id);

    if (!found) {
      setLocalMsg({ type: 'error', text: 'Invalid user' });
      setSelectedUser(null);
      return;
    }

    setSelectedUser(found);
  }, [id]);

  const selectUserHandler = (c, i) => {
    try {
      navigate(`/contacts/${c.linkedUser._id}`);

    } catch (error) {
      console.error(error.message)
      setLocalMsg({ type: 'error', text: 'Invalid user' })
    }

  }



  return (

    <>
      {/* // Contact container  */}
      <div className='bg-slate-100 grid grid-cols-12 h-full py-2'>
        <PopupMsg message={localMsg} />

        {/* Left section(contact List) */}
        <div className={`col-span-12 md:col-span-6 min-h-0 flex flex-col ${id ? 'hidden md:flex' : 'flex'}`}>

          <div className='shrink-0 mt-4'>
            <h1 className="text-3xl text-center font-semibold">Contacts</h1>
            <p className='text-slate-800 text-center'>{`Welcome back ${properCase(logUser?.username)}`}</p>
          </div>

          {/* Contact List  */}
          <div className='w-full min-h-0 flex-1 flex flex-col justify-start items-start gap-4 overflow-y-auto'>
            {
              contacts
                .filter(c => !c.isDeleted)
                .map((c, i) => {
                  return <div key={i} onClick={(e) => selectUserHandler(c, i)} className={`w-full cursor-pointer`}>
                    <ContactList key={i} c={c} />
                  </div>
                })
            }

          </div>
        </div>



        {/* Right section  */}

        <div className={`col-span-12 md:col-span-6 md:block h-full min-h-0 ${id ? 'block' : 'hidden md:block'}`}>

          {id ? (
            <Outlet context={selectedUser} />
          ) : (
            <div className="hidden md:flex h-full items-center justify-center text-slate-400">
              Select a contact to start chatting.
            </div>
          )}

        </div>


      </div>

    </>
  )
}
