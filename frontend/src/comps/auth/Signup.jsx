import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signupAPI } from '../api/api';
import PopupMsg from '../PopupMsg';
import useAutoClearMessage from '../../customHooks/useAutoClearMessage';

export default function Signup() {

  const [formData, setFormData] = useState({ username: '', email: '', mobile: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()

  // This messages account deleted popup msg which share in signup page.
  useEffect(() => {
    if (location.state?.success) {
      setMessage({ type: 'success', text: location.state.success })
    }
  }, [])


  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.name]: e.target.value
      }
    )
  }


  const handleSubmit = async (e) => {
    e.preventDefault();


    // Handle form submission logic here

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      return setMessage({ type: "error", text: "All fields are required." });
    }

    if (formData.password.length < 6) {
      return setMessage({ type: "error", text: "Password must be at least 6 characters long." });
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      return setMessage({ type: "error", text: "Please enter a valid email address." });
    }

    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      return setMessage({ type: 'error', text: 'Please enter a valid mobile number.' })
    }
    // If all validations pass

    // Call the signup API function
    setLoading(true);

    try {
      const { response, data } = await signupAPI(formData);

      if (!response.ok) {
        return setMessage({ type: "error", text: data.msg || "Signup failed. Please try again." });
      }

      setFormData({ username: '', email: '', mobile: '', password: '' });
      // navigate('/otp-verify', { state: { email: formData.email } });
      return navigate('/login', { state: { success: data.msg } })
      // return setMessage({ type: "success", text: data.msg || "OTP sent to your email" });
    } catch (error) {

      console.error("Error during signup:", error.message);
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);

    }
  }

  //After 2 second popup message will close.
  useAutoClearMessage(message, setMessage, 2000)

  return (
    <div className='container mx-auto'>
      <PopupMsg message={message} />
      <div className="px-2 py-6 text-center" style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '10px 15px',
        border: '1px solid #ffeeba',
      }}>
        Signup may take time because data comes from render and it takes a while.
      </div>
      <h1 className="text-2xl text-center mt-4">Create your account</h1>

      <form onSubmit={handleSubmit} className='w-full max-w-md mx-auto mt-2 p-6 md:rounded-lg shadow-md'>

        {/* field inputs  */}
        <div className='w-full mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
            Username
          </label>
          <input
            type="text"
            id='username'
            name='username'
            value={formData.username || ''}
            onChange={handleChange}
            className='w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-2' />
        </div>

        <div className='w-full mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
            Email
          </label>
          <input
            type="text"
            id='email'
            name='email'
            value={formData.email || ''}
            onChange={handleChange}
            className='w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-2' />
        </div>

        <div className='w-full mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='mobile'>
            Mobile
          </label>
          <input
            type="tel"
            id='mobile'
            name='mobile'
            value={formData.mobile || ''}
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
            value={formData.password || ''}
            onChange={handleChange}
            className='w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-2' />
        </div>

        {/* Action Button */}

        <div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-md cursor-pointer'>
            {loading ? 'Wait...' : 'Signup'}
          </button>
          <Link to="/login" className='block mt-2 text-emerald-900'>Already have an account?</Link>

          {/* <p className={`${message && message.type === 'error' ? 'text-red-800' : 'text-green-500'} mt-2`}>{message && message.text}</p> */}
        </div>



      </form >

    </div >
  )
}
