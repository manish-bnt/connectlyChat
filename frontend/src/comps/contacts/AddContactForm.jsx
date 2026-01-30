import React, { useContext, useEffect, useState } from 'react'
import { addContactAPI } from '../api/api'
import PopupMsg from '../PopupMsg'
import { Usercontext } from '../../App'

export default function AddContactForm({ contact, setContact, handleChange }) {
  // console.log("chihld redndered 1")
  const { setContacts } = useContext(Usercontext)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const saveHandler = async (e) => {
    e.preventDefault()
    if (!contact.name || !contact.mobile) {
      return setMessage({ type: 'error', text: 'Incomplete information. Please fill all required fields.' })
    }
    // if (!contact.name || !contact.email || !contact.mobile) {
    //   return setMessage({ type: 'error', text: 'Incomplete information. Please fill all required fields.' })
    // }

    if (contact.email && !/\S+@\S+\.\S+/.test(contact.email)) {
      return setMessage({ type: 'error', text: 'Please enter a valid email address.' })
    }

    if (contact.mobile && !/^[6-9]\d{9}$/.test(contact.mobile)) {
      return setMessage({ type: 'error', text: 'Please enter a valid mobile number.' })
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await addContactAPI(contact, token)

      // console.log("Response add contact ", response)
      // console.log("Data add contact ", data)

      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'Unable to save contact. Please try again later.' })
      }

      setContact({ name: "", email: "", mobile: "", address: "" })
      setContacts(prev => [...prev, data.data])
      setMessage({ type: 'success', text: data.msg || 'Contact saved successfully!' })

    } catch (error) {
      console.error("Error during adding contact: ", error.message)
      return setMessage({ type: 'error', text: 'Oops! something went wrong.' })
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <>
      <PopupMsg message={message} />
      <form onSubmit={saveHandler} className='w-full max-w-md mx-auto shadow-2xl border border-slate-100 rounded-xl p-6 bg-white mt-4'>
        <div className='space-y-4'>
          <label className='block text-slate-700 text-sm font-semibold m-1' htmlFor="name">Name</label>
          <input type="text"
            id='name'
            name='name'
            value={contact.name}
            onChange={handleChange}
            className='w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
          />
        </div>


        <div className='w-full'>
          <label className='block text-slate-700 text-sm font-semibold m-1' htmlFor="mobile">Mobile</label>
          <input type="tel"
            id='mobile'
            name='mobile'
            value={contact.mobile}
            onChange={handleChange}
            className='w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
          />
        </div>

        <div className='w-full'>
          <label className='block text-slate-700 text-sm font-semibold m-1' htmlFor="email">Email (Optional)</label>
          <input type="email"
            id='email'
            name='email'
            value={contact.email}
            onChange={handleChange}
            className='w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
          />
        </div>


        <div className='w-full'>
          <label className='block text-slate-700 text-sm font-semibold m-1' htmlFor="address">Address (Optional)</label>
          <input type="text"
            id='address'
            name='address'
            value={contact.address}
            onChange={handleChange}
            className='w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
          />
        </div>

        {/* Action Button  */}
        <div className='mt-4'>
          <button
            disabled={loading}
            className='w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-100 cursor-pointer'
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </form>
    </>
  )
}
