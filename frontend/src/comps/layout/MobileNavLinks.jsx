import GuestLinks from "./GuestLinks"

export default function MobileNavLinks() {
  const token = localStorage.getItem("loggedToken")
  return (
    <div className="flex md:hidden items-center gap-8">
      {!token && <GuestLinks />}
    </div>
  )
}
