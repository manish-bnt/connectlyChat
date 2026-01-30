import { Link } from 'react-router-dom'

export default function AuthLinks() {
  return (
    <>
      <Link
        className='relative text-slate-600 font-medium transition-all duration-300 hover:text-emerald-600 after:content-[""] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full'
        to="/contacts"
      >
        Chats
      </Link>

      <Link
        className='relative text-slate-600 font-medium transition-all duration-300 hover:text-emerald-600 after:content-[""] after:absolute after:w-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full'
        to="/add-contact"
      >
        Add Contact
      </Link>
    </>

  )
}
