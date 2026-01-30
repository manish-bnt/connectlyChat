import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { resendOtpAPI, verifyOtpAPI } from '../api/api';
import PopupMsg from '../PopupMsg';
import useAutoClearMessage from '../../customHooks/useAutoClearMessage';

export default function Otp() {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [message, setMessage] = useState(null)
  const [isVerifying, setIsverifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [seconds, setSeconds] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef([]);
  const { state } = useLocation() || {};
  const email = state?.email || '';
  const navigate = useNavigate()

  // console.log("location email ", email);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds > 0 ? prevSeconds - 1 : 0)

    }, 1000)
    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; // only allow numbers

    // update state with new otp value
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input box if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    // console.log("new otp before ", newOtp);
    // console.log("value ", value)
  }

  const handleKeyDown = (e, index) => {
    // backspace handling to move to previous box
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    // Verify OTP logic here
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      return setMessage({ type: 'error', text: 'Please enter a valid 6 digit OTP' })
    }

    setIsverifying(true);

    try {
      const { response, data } = await verifyOtpAPI({ email, OTP: enteredOtp })
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'OTP verification failed. Please try again.' })
      }
      navigate('/login', {
        replace: true,
        state: { success: data.msg || 'OTP verified successfully!' }
      })

    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      setMessage({ type: 'error', text: 'Something went wrong during OTP verification. Please try again.' });
    } finally {
      setIsverifying(false);
    }

  }

  const resendOtp = async (e) => {
    e.preventDefault();
    // console.log("hello")
    setIsResending(true);

    try {
      const { response, data } = await resendOtpAPI({ email });
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || 'Failed to resend OTP. Please try again.' });
      }

      // Restart timer 
      setSeconds(300)
      setMessage({ type: 'success', text: data.msg || 'OTP resent successfully!' });

    } catch (error) {
      console.error('Error during resend OTP:', error.message);
      setMessage({ type: 'error', text: 'Something went wrong while resending OTP. Please try again.' })

    } finally {
      setIsResending(false);
    }

  }

  useAutoClearMessage(message, setMessage, 2000)

  return (
    <div className='flex flex-col justify-center items-center mt-10 px-4'>
      <PopupMsg message={message} />
      <h2 className='text-xl md:text-2xl font-bold mb-2 md:mb-4'>Verify OTP</h2>
      <p className='text-gray-500 mb-6 text-sm md:text-base'>Enter the 6 digit code sent to your email.</p>

      <div className='flex gap-1 md:gap-2'>
        {otp.map((box, index) => {
          return <input
            className='bg-gray-200 w-9 h-10 xs:w-10 xs:h-11
             md:w-12 md:h-12 text-center text-lg md:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-emerald-400 focus:outline-none transition-all'
            value={box}
            ref={(el) => inputRefs.current[index] = el}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            key={index} type="text" />
        })}
      </div>

      <div className="flex justify-center items-center gap-4">

        <button className='mt-8 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold cursor-pointer'
          disabled={isVerifying}
          onClick={verifyOtp}>
          {isVerifying ? 'wait...' : 'Verify'}
        </button>

        <button
          disabled={isResending || seconds > 0}
          onClick={resendOtp}
          className={`mt-8 px-4 py-2 text-white rounded-lg font-bold cursor-pointer ${seconds > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500'
            }`}>
          {isResending ? 'wait...' : 'Resend'}
        </button>

      </div>

      <div className='mt-4 text-gray-600'>
        {`Time remaining : ${formatTime(seconds)}`}
      </div>

      {/* {message && (
        <div className={`mt-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )} */}

    </div>
  )
}
