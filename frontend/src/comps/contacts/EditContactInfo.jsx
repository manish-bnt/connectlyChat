import { faArrowLeft, faEnvelope, faLocation, faPhone, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useEffect, useState } from 'react'
import { deleteContactAPI, updateContactAPI } from '../api/api'
import { Usercontext } from '../../App'
import PopupMsg from '../PopupMsg'
import { useNavigate } from 'react-router-dom'
import Spinner from '../Spinner'
export default function EditContactInfo({ setPanel, friend }) {
  const { setContacts, fetchContacts } = useContext(Usercontext)
  const [editContact, setEditContact] = useState(friend)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputHandler = (e) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      setMessage(null)
    }, 2000);

    return () => clearTimeout(timer)
  }, [message])

  const saveHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await updateContactAPI(token, editContact)
      // console.log("updated data ", data)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || "updation failed" })
      }

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === data.data._id ? data.data : contact
        )
      )

      fetchContacts()

      setPanel("contact")
      // setMessage({ type: 'success', text: data.msg || "Contact updated successfully" })

    } catch (error) {
      console.error(error.message)
      return setMessage({ type: 'error', text: `Error during updation: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const deleteHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await deleteContactAPI(token, friend)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'Unable to delete the contact' })
      }
      // setMessage({ type: 'success', text: data.msg || 'Contact deleted successfully!' })
      setContacts(data.data)
      fetchContacts()
      navigate('/')
    } catch (error) {
      console.log(error.message)
      return setMessage({ type: 'error', text: 'delete contact error' })
    } finally {
      setLoading(false)
    }

  }

  if (loading) {
    return <Spinner />
  }


  return (
    <div className='w-full h-full flex flex-col'>
      <PopupMsg message={message} />
      {/* Edit top header */}
      <div className='flex px-2 py-4 items-center gap-4'>
        <FontAwesomeIcon onClick={() => setPanel("contact")} icon={faArrowLeft} className='text-slate-600 cursor-pointer' />
        <div className='flex flex-1 justify-between items-center'>
          <h2>Edit contact</h2>
          <FontAwesomeIcon onClick={deleteHandler} icon={faTrash} className='text-slate-600 cursor-pointer' />
        </div>
      </div>

      {/* Edit form  */}

      <form onSubmit={saveHandler} className='w-full flex-1 flex flex-col gap-10 px-4'>
        <div className='w-full flex'>
          <label htmlFor="name">
            <FontAwesomeIcon className='text-emerald-600' icon={faUser} />
          </label>
          <input
            onChange={inputHandler}
            name='name'
            value={editContact?.name}
            type="text"
            id='name'
            className='border-b border-slate-700 border-t-0 border-l-0 border-r-0 outline-0 mx-2 w-full' />
        </div>

        <div className='w-full flex'>
          <label htmlFor="mobile">
            <FontAwesomeIcon className='text-emerald-600' icon={faPhone} />
          </label>
          <input
            onChange={inputHandler}
            name='mobile'
            value={editContact?.mobile}
            type="text"
            id='mobile'
            className='border-b border-slate-700 border-t-0 border-l-0 border-r-0 outline-0 mx-2 w-full' />
        </div>

        <div className='w-full flex'>
          <label htmlFor="email">
            <FontAwesomeIcon className='text-emerald-600' icon={faEnvelope} />
          </label>
          <input
            onChange={inputHandler}
            name='email'
            value={editContact?.email}
            type="text"
            id='email'
            className='border-b border-slate-700 border-t-0 border-l-0 border-r-0 outline-0 mx-2 w-full' />
        </div>

        <div className='w-full flex'>
          <label htmlFor="address">
            <FontAwesomeIcon className='text-emerald-600' icon={faLocation} />
          </label>
          <input
            onChange={inputHandler}
            name='address'
            value={editContact?.address}
            type="text"
            id='address'
            className='border-b border-slate-700 border-t-0 border-l-0 border-r-0 outline-0 mx-2 w-full' />
        </div>
        {/* Action button  */}
        <div className='flex-1 flex justify-center items-end p-4'>
          <button disabled={loading} type='submit' className='bg-emerald-400 hover:bg-emerald-600 px-4 py-2 rounded-full text-white cursor-pointer'>{loading ? "Saving..." : "Save"}</button>
        </div>

      </form>



    </div>
  )
}

