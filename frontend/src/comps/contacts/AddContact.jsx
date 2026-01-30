import React, { useState } from 'react'
import ContactCard from './ContactCard'
import AddContactForm from './AddContactForm'

export default function AddContact() {
  const [contact, setContact] = useState({ name: "", email: "", mobile: "", address: "" })

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value })
  }


  return (
    <div className="grid grid-cols-12 gap-2 py-10 px-4 md:px-10 ">

      {/* Left section: Form  */}

      <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center">
        <h1 className='text-2xl text-slate-800 font-semibold mb-4'>Add your Contact</h1>
        <AddContactForm setContact={setContact} contact={contact} handleChange={handleChange} />
      </div>

      {/* Right section: Card Preview Container */}

      <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center mt-12 md:mt-0">
        <h1 className='text-2xl text-slate-800 font-semibold mb-4'>Live Preview</h1>
        <ContactCard contact={contact} />
      </div>



    </div>
  )
}
