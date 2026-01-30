import React, { useContext, useRef, useState } from 'react'
import { Usercontext } from '../../App'
import { properCase } from '../../utility/utility'
import { deleteProfileAPI, uploadProfileAPI } from '../api/api'
import PopupMsg from '../PopupMsg'
import UpdateProfile from './UpdateProfile'
import useAutoClearMessage from '../../customHooks/useAutoClearMessage'

export default function MyProfile() {
  const { logUser, setLogUser, fetchUserDetails } = useContext(Usercontext)

  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [myFile, setMyFile] = useState("")
  const [preview, setPreview] = useState("")
  const fileRef = useRef()

  useAutoClearMessage(message, setMessage, 2000);

  const handleFile = (e) => {
    let file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setMyFile(file)
  }

  const handlePickedFile = (e) => {
    fileRef.current.click()
  }

  const uploadHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("avataar", myFile)
    setLoading(true)
    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await uploadProfileAPI(token, formData)
      // console.log("data profile image ", data)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'Failed to upload Image' })
      }
      setLogUser(data.user)
      return setMessage({ type: 'success', text: data.msg || 'Pofile Uploaded successfully' })
    } catch (error) {
      console.error(error.message)
      return setMessage({ type: 'error', text: `Error during upload image: ${error.message}` })
    } finally {
      setLoading(false)
    }
    // console.log("file uploaded ", myFile)
  }

  const deleteProfile = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await deleteProfileAPI(token)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || "Failed to delete profile." })
      }
      setLogUser(data.data)
      fetchUserDetails()
      return setMessage({ type: 'success', text: data.msg || 'Profile deleted successfully.' })
    } catch (error) {
      console.error('Error during in profile deletion.')
    }
  }

  const [isClickEdit, setIsClickEdit] = useState(false)

  const editProfileHandler = (e) => {
    setIsClickEdit(!isClickEdit)
  }

  return (
    <div className='grid grid-cols-12 h-full bg-slate-50 overflow-y-auto'>
      <PopupMsg message={message} />

      {/* Left Section - Profile Info */}
      <div className='col-span-12 lg:col-span-7 p-6 md:p-12'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-2xl font-bold text-slate-800 mb-8'>Account Settings</h1>

          {/* Profile Card */}
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
            <div className='p-8'>

              <div className='flex justify-between items-start mb-8'>
                {/* Avatar with Status */}
                <div className="relative flex flex-col gap-3 justify-center items-center">
                  {/* Profile Image Box */}
                  <div className="size-28 flex items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md border-4 border-white overflow-hidden">
                    {preview ? (
                      <img className='w-full h-full object-cover' src={preview} alt="preview" />
                    ) : logUser?.profile ? (
                      <img className='w-full h-full object-cover' src={logUser?.profile?.url} alt="profile" />
                      // <img className='w-full h-full object-cover' src={`${import.meta.env.VITE_API_URL}${logUser.profile}`} alt="profile" />
                    ) : (
                      <p className='font-bold text-4xl'>{properCase(logUser?.username[0])}</p>
                    )}
                  </div>

                  {/* Buttons Group */}
                  <div className='flex gap-2'>
                    {/* Upload/Add Button */}
                    <button
                      disabled={loading}
                      onClick={myFile ? uploadHandler : handlePickedFile}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95 text-xs font-bold shadow-sm ${myFile ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <i className={`fa-solid ${myFile ? "fa-cloud-arrow-up" : "fa-camera"}`}></i>
                      {myFile ? (loading ? "Saving..." : "Save Photo") : "Change"}
                    </button>

                    {/* Professional Delete Button - Sirf tab dikhe jab profile image ho */}
                    {(logUser?.profile || preview) && (
                      <button
                        disabled={loading}
                        onClick={deleteProfile}
                        className='flex items-center justify-center size-9 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95 border border-red-100 shadow-sm'
                        title="Delete Profile Photo"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    )}
                  </div>

                  <input ref={fileRef} onChange={handleFile} type="file" name='avataar' className='hidden' accept="image/*" />
                </div>

                <button onClick={editProfileHandler} className='flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-95 text-sm font-medium'>
                  <i className="fa-solid fa-pencil"></i>
                  Edit Profile
                </button>
              </div>

              {/* Data Rows */}
              <div className={`space-y-6 ${isClickEdit ? "hidden" : "block"}`}>
                <div>
                  <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Full Name</label>
                  <p className='text-lg font-medium text-slate-700'>{properCase(logUser?.username)}</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Email Address</label>
                    <p className='text-slate-700 font-medium'>{logUser?.email}</p>
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Mobile Number</label>
                    <p className='text-slate-700 font-medium'>{logUser?.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Update Profile      */}
              <UpdateProfile isClickEdit={isClickEdit} />
            </div>

            {/* Bottom Section inside card */}
            <div className='bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center'>
              <p className='text-xs text-slate-400'>Joined on {new Date(logUser?.createdAt).toLocaleDateString()}</p>
              <span className='px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase'>Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Security/Banner */}
      <div className="hidden lg:flex col-span-5 bg-emerald-600 items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Background UI */}
        <div className="absolute inset-0 opacity-10">
          <i className="fa-solid fa-shield-halved text-[20rem] -rotate-12 translate-x-20"></i>
        </div>

        <div className='relative z-10 text-center'>
          <div className='size-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6'>
            <i className="fa-solid fa-shield-check text-4xl"></i>
          </div>
          <h2 className='text-3xl font-bold mb-4'>Privacy First</h2>
          <p className='text-emerald-100 max-w-xs mx-auto'>
            {/* Your security is our priority. Your data is end-to-end encrypted and secure. */}
            Your data is stored securely. More security enhancements are coming soon.
          </p>
        </div>
      </div>

    </div>
  )
}
