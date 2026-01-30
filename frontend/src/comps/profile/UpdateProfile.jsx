import React, { useContext, useState } from 'react'
import { updateProfileAPI } from '../api/api'
import { Usercontext } from '../../App'
import PopupMsg from '../PopupMsg'
import useAutoClearMessage from '../../customHooks/useAutoClearMessage'

export default function UpdateProfile({ isClickEdit }) {
  const { logUser, setLogUser } = useContext(Usercontext)
  const [editProfile, setEditProfile] = useState(logUser)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useAutoClearMessage(message, setMessage, 2000)

  const handleChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value })
  }

  const updateHandler = async (e) => {
    e.preventDefault()
    // console.log("editProfile ", editProfile)
    setLoading(true)
    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await updateProfileAPI(token, editProfile)
      // console.log("updatedData comes form backend  ", data)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'failed to update profile' })
      }

      setLogUser(data.data)
      return setMessage({ type: 'success', text: data.msg || 'Updated successfully!' })
    } catch (error) {
      return setMessage({ type: 'error', text: `Error during updation: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Data Rows */}
      <div className={`space-y-6 ${isClickEdit ? "block" : "hidden"}`}>
        <PopupMsg message={message} />
        <div>
          <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Full Name</label>
          <input
            className='block outline outline-emerald-600 text-sm h-7 rounded-md p-2'
            type="text"
            name='username'
            onChange={handleChange}
            value={editProfile.username} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Email Address</label>
            <input
              className='block outline outline-emerald-600 text-sm h-7 rounded-md p-2'
              type="email"
              name='email'
              onChange={handleChange}
              value={editProfile.email} />
          </div>
          <div>
            <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Mobile Number</label>
            <input
              className='block outline outline-emerald-600 text-sm h-7 rounded-md p-2'
              type="mobile"
              name='mobile'
              onChange={handleChange}
              value={editProfile.mobile} />
          </div>
        </div>
        <button type='submit' disabled={loading} onClick={updateHandler} className='bg-emerald-400 text-sm text-white px-4 py-2 font-bold rounded-lg hover:bg-emerald-600 cursor-pointer'>{loading ? "Updating..." : "Update"}</button>
      </div>
    </>
  )
}
