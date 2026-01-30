import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { Usercontext } from '../../App'

export default function Layout() {
  const { selectedUser } = useContext(Usercontext)
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className={`${selectedUser ? "hidden md:block" : "block"} h-16 shrink-0 sticky top-0 z-50`}>
        <Navbar />
      </header>

      <main className="flex-1 overflow-hidden min-h-0">
        <Outlet />
      </main>
    </div>
  )
}


