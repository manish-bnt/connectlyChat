import { useContext, useState } from "react"
import { deleteAccountAPI } from "../api/api"
import { Usercontext } from "../../App"
import Spinner from "../Spinner"
import { useNavigate } from "react-router-dom"
import PopupMsg from "../PopupMsg"

export default function DesktopSettingDropdown({ setProfilePanel, PROFILE_STATE }) {
  const { setLogUser } = useContext(Usercontext)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const deleteAccountHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("loggedToken")
      const { response, data } = await deleteAccountAPI(token)
      if (!response.ok) {
        return setMessage({ type: 'error', text: data.msg || "Unable to delete account!" })
      }

      localStorage.removeItem("loggedToken")
      setLogUser(null)
      navigate('/signup', { state: { success: data.msg || "Account deleted successfully" } })
    } catch (error) {
      console.error(error.message)
      return setMessage({ type: 'error', text: error?.message || "Account deletion failed" })
    } finally {
      setLoading(false)
    }

  }


  return (
    <>
      <PopupMsg message={message} />
      {/* Back button */}
      <button
        onClick={() => setProfilePanel(PROFILE_STATE.DROPDOWN)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 w-full"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back
      </button>

      <div className="h-[1px] bg-slate-100 my-1"></div>

      {/* Delete account */}
      <button
        onClick={deleteAccountHandler}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
      >
        <i className="fa-solid fa-trash"></i>
        Delete Account
      </button>
    </>
  )
}
