import React from 'react'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Usercontext } from '../../App'
import Spinner from '../Spinner'

export default function AuthPage({ children }) {
  // const { initializing } = useContext(Usercontext)
  const token = localStorage.getItem('loggedToken')

  if (!token) {
    return <Navigate to="/login" replace={true} />
  }

  return (
    <div className="h-full w-full overflow-hidden min-h-0">
      {children}
    </div>
  )
}
