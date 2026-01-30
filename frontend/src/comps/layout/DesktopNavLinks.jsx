import { Link } from 'react-router-dom'
import GuestLinks from './GuestLinks'
import AuthLinks from './AuthLinks'
export default function DesktopNavLinks() {
  const token = localStorage.getItem("loggedToken")
  return (
    <div className="hidden md:flex items-center gap-8">
      {!token ? <GuestLinks /> : <AuthLinks />}
    </div>
  )
}
