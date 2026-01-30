import React from 'react'
import Contact from '../comps/contacts/Contact'
export default function ContactPage() {

  // Page-level component for Contacts route
  // This component only acts as a wrapper around the Contact component

  return (
    // Full-height section to properly fit the Contact layout
    <section className="h-full w-full min-h-0">
      <Contact />
    </section >
  )
}
