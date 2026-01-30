import React, { useContext, useEffect, useState } from 'react'
import { Link, replace, useLocation, useNavigate } from 'react-router-dom'
import { getMe, loginAPI } from '../api/api'
import { Usercontext } from '../../App'
import PopupMsg from '../PopupMsg'
import { v4 as uuidv4 } from "uuid"
import useAutoClearMessage from '../../customHooks/useAutoClearMessage'

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate()
  const { setLogUser, fetchUserDetails } = useContext(Usercontext)
  const location = useLocation()
  useAutoClearMessage(message, setMessage, 2000)

  useEffect(() => {
    if (location.state?.success) {
      return setMessage({ type: 'success', text: location.state.success })
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      return setMessage({ type: 'error', text: 'All fields are required' })
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      return setMessage({ type: "error", text: "Please enter a valid email address." });
    }

    setLoading(true)

    try {
      const { response, data } = await loginAPI(formData)
      // console.log("login API response ", response)
      // console.log("login API data ", data)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'Login failed! try again' })
      }

      localStorage.setItem('loggedToken', data.token)
      // after login success
      const demoSessionId = uuidv4();
      // const demoSessionId = crypto.randomUUID()
      localStorage.setItem("demoSessionId", demoSessionId)

      setLogUser(data.user) // global context
      fetchUserDetails()



      // Navigate with state for showing message in Home page 

      navigate('/', { replace: true, state: { success: data.msg || "You've logged in successfully" } })

      return setMessage({ type: 'success', text: data.msg || "You've logged in successfully" })
    } catch (error) {
      console.error("Error during login ", error.message)
      return setMessage({ type: 'error', text: 'something went wrong' })
    } finally {
      setLoading(false)
    }

  }


  const handleDemoLogin = async () => {
    setDemoLoading(true)

    try {
      const demoCredentials = {
        email: "demo@gmail.com",
        password: "Demo@123"
      }

      const { response, data } = await loginAPI(demoCredentials)

      if (!response.ok) {
        return setMessage({ type: 'error', text: 'Demo login failed' })
      }

      localStorage.setItem('loggedToken', data.token)

      const demoSessionId = uuidv4()
      // const demoSessionId = crypto.randomUUID()
      localStorage.setItem("demoSessionId", demoSessionId)

      setLogUser(data.user)
      fetchUserDetails()

      navigate('/', {
        replace: true,
        state: { success: 'Logged in as Demo User' }
      })

    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setDemoLoading(false)
    }
  }




  return (
    <>
      <PopupMsg message={message} />
      <div className="px-2 py-6 text-center" style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '10px 15px',
        border: '1px solid #ffeeba',
      }}>
        Login may take time because data comes from render and it takes a while.
      </div>
      <div className='container mx-auto'>
        <h1 className="text-2xl text-center mt-4">Login your account</h1>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md mx-auto mt-2 p-6 md:rounded-lg shadow-md'>

          {/* field inputs  */}
          <div className='w-full mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
              Email
            </label>
            <input
              type="text"
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-2' />
          </div>


          <div className='w-full mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <input
              type="password"
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-2' />
          </div>

          {/* Action Button */}

          {/* <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-md cursor-pointer'>
              {loading ? 'Wait...' : 'Login'}
            </button>

            <Link to="/signup" className='block mt-2 text-emerald-900'>Create an account!</Link>

          </div> */}

          <div className="flex flex-col gap-3 mt-4">

            {/* Primary Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-md cursor-pointer"
            >
              {loading ? 'Please wait...' : 'Login'}
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-medium py-2 rounded-md cursor-pointer"
            >
              {demoLoading ? 'Please wait...' : 'Login as Demo User'}
            </button>

            <p className="text-xs text-center text-gray-500">
              No signup required. Explore the project instantly.
            </p>

          </div>

        </form >

      </div >
    </>
  )
}
